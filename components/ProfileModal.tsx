'use client'

import { useState } from 'react'
import { User } from '@/types/user'

interface ProfileModalProps {
  user: User
  onClose: () => void
  onUpdate: (data: { display_username: string; website_url: string }) => void
}

export default function ProfileModal({ user, onClose, onUpdate }: ProfileModalProps) {
  const [displayUsername, setDisplayUsername] = useState(user.display_username || '')
  const [websiteUrl, setWebsiteUrl] = useState(user.website_url || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.github_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_username: displayUsername,
          website_url: websiteUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      onUpdate({ display_username: displayUsername, website_url: websiteUrl })
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Edit Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              placeholder={user.github_username}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will be shown instead of your GitHub username
            </p>
          </div>
          <div className="mb-6">
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
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

