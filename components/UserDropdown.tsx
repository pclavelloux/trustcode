'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { User } from '@/types/user'

interface UserDropdownProps {
  currentUser: User
  onSignOut: () => void
}

export default function UserDropdown({ currentUser, onSignOut }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    onSignOut()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[#161b22] transition-colors border border-[#21262d]"
        aria-label="User menu"
      >
        <Settings className="w-5 h-5 text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#161b22] rounded-lg shadow-xl border border-[#21262d] py-1 z-50">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#21262d] transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            Edit my profile
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#21262d] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

