import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchGitHubContributions } from '@/lib/github'
import { upsertDailyContributions } from '@/lib/contributions'

/**
 * Endpoint pour rattraper les lignes manquantes dans daily_contributions
 * 
 * Cet endpoint:
 * 1. Récupère tous les profils avec un github_token
 * 2. Pour chaque profil, récupère les contributions GitHub
 * 3. Compare avec ce qui existe dans daily_contributions
 * 4. Insère les jours manquants
 * 
 * Protection: Vérifie le secret CRON_SECRET dans les headers
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret pour protéger l'endpoint
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('CRON_SECRET is not configured')
      return NextResponse.json(
        { error: 'Cron secret not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Créer un client Supabase avec service role pour accéder à tous les profils
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured')
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Récupérer tous les profils qui ont un github_token
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, github_username, github_token')
      .not('github_token', 'is', null)
      .neq('github_token', '')

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      )
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No profiles with GitHub tokens found',
        updated: 0,
        failed: 0,
        added: 0,
      })
    }

    console.log(`📊 Found ${profiles.length} profiles with GitHub tokens`)

    // Rattraper les contributions pour chaque profil
    let updated = 0
    let failed = 0
    let totalAdded = 0
    const errors: Array<{ userId: string; username: string; error: string }> = []

    for (const profile of profiles) {
      try {
        if (!profile.github_token || !profile.github_username) {
          continue
        }

        // Récupérer les contributions avec le token stocké
        const contributions = await fetchGitHubContributions(
          profile.github_username,
          profile.github_token
        )

        // Récupérer les contributions existantes dans daily_contributions
        const { data: existingContributions, error: existingError } = await supabase
          .from('daily_contributions')
          .select('date')
          .eq('user_id', profile.id)

        if (existingError) {
          throw new Error(`Failed to fetch existing contributions: ${existingError.message}`)
        }

        const existingDates = new Set(
          (existingContributions || []).map((c) => c.date)
        )

        // Trouver les dates manquantes
        const missingDates = Object.keys(contributions).filter(
          (date) => !existingDates.has(date)
        )

        if (missingDates.length > 0) {
          console.log(
            `📅 Found ${missingDates.length} missing dates for ${profile.github_username}`
          )

          // Insérer/mettre à jour toutes les contributions (y compris les manquantes)
          await upsertDailyContributions(
            profile.id,
            contributions,
            supabase
          )

          totalAdded += missingDates.length
          updated++
          console.log(
            `✅ Added ${missingDates.length} missing dates for ${profile.github_username}`
          )
        } else {
          // Même s'il n'y a pas de dates manquantes, on met à jour pour s'assurer que les données sont à jour
          await upsertDailyContributions(
            profile.id,
            contributions,
            supabase
          )
          updated++
          console.log(
            `✅ Updated contributions for ${profile.github_username} (no missing dates)`
          )
        }
      } catch (error) {
        failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push({
          userId: profile.id,
          username: profile.github_username || 'unknown',
          error: errorMessage,
        })
        console.error(
          `❌ Failed to catchup contributions for ${profile.github_username}:`,
          errorMessage
        )
        // Continue avec les autres profils même si celui-ci échoue
      }
    }

    return NextResponse.json({
      success: true,
      message: `Catchup completed: ${updated} profiles updated, ${totalAdded} missing dates added, ${failed} failed`,
      updated,
      failed,
      totalAdded,
      total: profiles.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in catchup script:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to catchup contributions',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

