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

export async function GET() {
  try {
    // Vérifier tous les sponsors dans la base
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sponsors:', error)
      return NextResponse.json({ error: error.message, sponsors: [] })
    }

    return NextResponse.json({ 
      count: sponsors?.length || 0,
      sponsors: sponsors || [] 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      sponsors: [] 
    })
  }
}

