'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types/user'
import LeaderboardTable from '@/components/LeaderboardTable'
import Header from '@/components/Header'
import { User as UserIcon } from 'lucide-react'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Check for success/error messages in URL
    const params = new URLSearchParams(window.location.search)
    if (params.get('success')) {
      setSuccessMessage('Successfully connected to GitHub!')
      // Remove query params from URL
      window.history.replaceState({}, '', '/')
      // Wait a bit for the profile to be created, then fetch current user
      // Retry multiple times in case the profile takes time to be created
      const retryFetchUser = async (attempts = 5) => {
        for (let i = 0; i < attempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)))
          try {
            const response = await fetch('/api/me')
            if (response.ok) {
              const data = await response.json()
              if (data.profile) {
                setCurrentUser(data.profile)
                fetchUsers() // Refresh users list
                return // Success, stop retrying
              }
            }
          } catch (error) {
            console.error('Error fetching user:', error)
          }
        }
        // If we get here, still refresh users list
        fetchUsers()
      }
      retryFetchUser()
    }
    if (params.get('error')) {
      setErrorMessage(params.get('error') || 'An error occurred')
      window.history.replaceState({}, '', '/')
    }

    fetchUsers()
    fetchCurrentUser()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setErrorMessage('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/me')
      if (!response.ok) {
        throw new Error('Failed to fetch current user')
      }
      const data = await response.json()
      setCurrentUser(data.profile)
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-100">
      {/* Header */}
      <Header currentUser={currentUser} onSignOut={handleSignOut} />

      {/* Messages */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-[#0e4429] border border-[#26a641] rounded-lg p-4 shadow-xl">
            <p className="text-[#39d353] text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 shadow-xl">
            <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            GitHub Best Contributors
          </h1>
          <p className="text-gray-400 text-lg">
            Top developers ranked by contributions
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#21262d] border-t-[#39d353]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24">
            <UserIcon className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No contributors yet
            </h3>
            <p className="text-gray-500">
              Be the first to add your GitHub account!
            </p>
          </div>
        ) : (
          <LeaderboardTable
            users={users}
            currentUserGithubUsername={currentUser?.github_username}
          />
        )}
      </div>
    </main>
  )
}
