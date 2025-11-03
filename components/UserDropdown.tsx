'use client'

import { Settings, LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { User } from '@/types/user'

interface UserDropdownProps {
  currentUser: User
  onSignOut: () => void
}

export default function UserDropdown({ currentUser, onSignOut }: UserDropdownProps) {
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    onSignOut()
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle rounded-gh">
        <Settings className="w-5 h-5" />
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-gh w-52 border border-base-300">
        <li>
          <Link href="/profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Edit my profile</span>
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

