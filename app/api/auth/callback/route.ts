import { createServerClient } from "@supabase/ssr";
import { fetchGitHubContributions } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const response = NextResponse.redirect(
    new URL(code ? "/?success=true" : "/?error=no_code", requestUrl.origin)
  );

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Échanger le code contre une session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Error exchanging code for session:", sessionError);
      return NextResponse.redirect(
        new URL(
          `/?error=${encodeURIComponent(sessionError.message)}`,
          requestUrl.origin
        )
      );
    }

    if (session?.user) {
      // Log de diagnostic pour vérifier si le provider_token est présent
      console.log('Session data:', {
        hasProviderToken: !!session.provider_token,
        providerTokenLength: session.provider_token?.length || 0,
        userId: session.user.id,
        username: session.user.user_metadata.user_name || session.user.user_metadata.preferred_username
      })
      
      if (!session.provider_token) {
        console.error('❌ PROBLEM: provider_token is missing from session!')
        console.error('This usually means:')
        console.error('1. GitHub provider in Supabase is not configured to return the provider token')
        console.error('2. Check Dashboard > Authentication > Providers > GitHub > Enable Provider Refresh Token')
      }
      
      try {
        // Vérifier si c'est une première connexion (profil existait déjà?)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, created_at")
          .eq("id", session.user.id)
          .single();

        const isFirstTime =
          !existingProfile ||
          (existingProfile &&
            new Date(existingProfile.created_at).getTime() >
              Date.now() - 60000); // Créé il y a moins d'1 minute

        // Récupérer les contributions GitHub
        const githubUsername =
          session.user.user_metadata.user_name ||
          session.user.user_metadata.preferred_username;

        if (githubUsername) {
          const contributions = await fetchGitHubContributions(
            githubUsername,
            session.provider_token
          );

          const totalContributions = Object.values(contributions).reduce(
            (sum, count) => sum + count,
            0
          );

          // Mettre à jour le profil avec les contributions
          console.log("🔍 DEBUG - User ID:", session.user.id);
          console.log("🔍 DEBUG - Session valid:", !!session);
          console.log("🔍 DEBUG - Provider token:", !!session.provider_token);
          console.log(
            "🔍 DEBUG - Contributions fetched:",
            Object.keys(contributions).length,
            "days"
          );

          // Mettre à jour le profil avec les contributions
          const { error: updateError, data: updateData } = await supabase
          .from('profiles')
          .update({
            contributions_data: contributions,
            total_contributions: totalContributions,
            last_updated: new Date().toISOString(),
          })
          .eq('id', session.user.id)

          if (updateError) {
            console.error("❌ Error updating contributions:", updateError);
            console.error(
              "❌ Error details:",
              JSON.stringify(updateError, null, 2)
            );
          } else {
            console.log("✅ Update successful:", updateData);
          }

          // Si c'est une première connexion, ajouter un paramètre dans l'URL
          if (isFirstTime) {
            const redirectUrl = new URL(
              "/?success=true&firstTime=true",
              requestUrl.origin
            );
            return NextResponse.redirect(redirectUrl);
          }
        } else if (!session.provider_token) {
          console.warn('⚠️ Cannot fetch contributions: provider_token is missing')
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
        // Continue même si la récupération des contributions échoue
      }
    }
  }

  return response;
}
