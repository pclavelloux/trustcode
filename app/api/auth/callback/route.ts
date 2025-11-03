import { createServerClient } from '@supabase/ssr'
import { fetchGitHubContributions } from '@/lib/github'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const response = NextResponse.redirect(new URL(code ? '/?success=true' : '/?error=no_code', requestUrl.origin))

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(cookie => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    
    // Échanger le code contre une session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin)
      )
    }

    if (session?.provider_token && session?.user) {
      try {
        // Récupérer les contributions GitHub
        const githubUsername = session.user.user_metadata.user_name || 
                               session.user.user_metadata.preferred_username
        
        if (githubUsername) {
          const contributions = await fetchGitHubContributions(
            githubUsername,
            session.provider_token
          )

          const totalContributions = Object.values(contributions).reduce(
            (sum, count) => sum + count,
            0
          )

          // Mettre à jour le profil avec les contributions
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              contributions_data: contributions,
              total_contributions: totalContributions,
              last_updated: new Date().toISOString(),
            })
            .eq('id', session.user.id)

          if (updateError) {
            console.error('Error updating contributions:', updateError)
          }
        }
      } catch (error) {
        console.error('Error fetching contributions:', error)
        // Continue même si la récupération des contributions échoue
      }
    }
  }

  return response
}
