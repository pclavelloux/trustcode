'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import Header from '@/components/ui/header'
import { Trash2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [displayUsername, setDisplayUsername] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/me')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      
      if (!data.profile) {
        router.push('/')
        return
      }

      setCurrentUser(data.profile)
      setWebsiteUrl(data.profile.website_url || '')
      setDisplayUsername(data.profile.display_username || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      if (!currentUser) return

      const response = await fetch(`/api/users/${currentUser.github_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_username: displayUsername || null,
          website_url: websiteUrl || null,
        }),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile')
      }

      setCurrentUser(responseData)
      setSuccess('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      if (!currentUser) return

      const response = await fetch(`/api/users/${currentUser.github_id}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }

      // Redirect to home
      router.push('/')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account. Please try again.')
      setIsDeleting(false)
    }
  }

  const handleSignOut = () => {
    router.push('/')
    window.location.reload()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header currentUser={null} onSignOut={handleSignOut} />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
     
      </main>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header currentUser={currentUser} onSignOut={handleSignOut} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Profile
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Display Username */}
            <div>
              <label
                htmlFor="display_username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Display Username
              </label>
              <input
                type="text"
                id="display_username"
                value={displayUsername}
                onChange={(e) => setDisplayUsername(e.target.value)}
                placeholder={currentUser.github_username}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This will be shown instead of your GitHub username
              </p>
            </div>

            {/* Website URL */}
            <div>
              <label
                htmlFor="website_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Website URL
              </label>
              <input
                type="url"
                id="website_url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your username will link to this website
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Deleting your account will permanently remove all your data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>

      
    </main>
  )
}

