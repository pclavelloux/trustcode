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
    <div className="navbar bg-base-100 border-b border-base-200 shadow-sm sticky top-0 z-50 rounded-none">
      <div className="navbar-end flex-1">
        {currentUser ? (
          <UserDropdown currentUser={currentUser} onSignOut={onSignOut} />
        ) : (
          <GitHubConnectButton />
        )}
      </div>
    </div>
  )
}

