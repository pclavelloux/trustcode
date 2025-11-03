'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'

interface GitHubConnectButtonProps {
  isAuthenticated?: boolean
  onSignOut?: () => void
  label?: string
}

export default function GitHubConnectButton({ isAuthenticated, onSignOut, label }: GitHubConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          scopes: 'read:user',
          skipBrowserRedirect: false,
        },
      })
      
      if (error) {
        console.error('Error signing in with GitHub:', error)
        alert('Failed to connect to GitHub. Please try again.')
        setIsLoading(false)
      }
      // Si pas d'erreur, le navigateur sera redirigé vers GitHub
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      if (onSignOut) {
        onSignOut()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="btn btn-error btn-sm rounded-gh"
      >
        {isLoading && <span className="loading loading-spinner loading-xs"></span>}
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </button>
    )
  }

  return (
    <button 
      onClick={handleConnect}
      disabled={isLoading}
      className="rounded-sm bg-gh-white text-gh-tertiary border border-gh-tertiary hover:shadow-xl hover:bg-gh-white2 hover:border-gh-tertiary px-3 py-1.5 gap-2 inline-flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          <span className="text-sm">Connecting...</span>
        </>
      ) : (
        <>
          <FaGithub className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="whitespace-nowrap text-sm">{label || 'Add my GitHub'}</span>
        </>
      )}
    </button>
  )
}

