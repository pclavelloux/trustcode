'use client'

import GitHubConnectButton from './GitHubConnectButton'
import UserDropdown from './UserDropdown'
import { User } from '@/types/user'

interface HeaderProps {
  currentUser: User | null
  onSignOut: () => void
}

export default function Header({ currentUser, onSignOut }: HeaderProps) {
  return (
    <header className="bg-[#0d1117] border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end">
          {/* Right side - Connect button or User dropdown */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <UserDropdown currentUser={currentUser} onSignOut={onSignOut} />
            ) : (
              <GitHubConnectButton />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

