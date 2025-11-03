import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Route pour nettoyer les sponsors de test
export async function POST() {
  try {
    // Supprimer tous les sponsors avec email temporaire ou status pending
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .or('email.like.temp-%@pending.com,status.eq.pending')

    if (error) {
      console.error('Error cleaning up sponsors:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test sponsors cleaned up successfully' 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

