'use client'

import { useState } from 'react'

interface GitHubTokenModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function GitHubTokenModal({ onClose, onSuccess }: GitHubTokenModalProps) {
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/refresh-contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contributions')
      }

      alert(`✅ Contributions mises à jour ! Total: ${data.total_contributions.toLocaleString()}`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating contributions:', error)
      setError(error instanceof Error ? error.message : 'Failed to update contributions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          🔑 Connecter votre GitHub Token
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-3">
            <strong>Pourquoi ?</strong> Le token permet d'accéder à vos contributions <strong>privées</strong> 
            et d'avoir le vrai total incluant tous vos commits.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            🔒 Votre token est stocké de manière sécurisée et utilisé uniquement pour récupérer vos contributions.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            📝 Comment obtenir votre token :
          </h3>
          <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
            <li>
              Allez sur{' '}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
              </a>
            </li>
            <li>Cliquez sur <strong>"Generate new token (classic)"</strong></li>
            <li>
              <strong>Note:</strong> "TrustCode Contributions"
            </li>
            <li>
              <strong>Expiration:</strong> No expiration (ou 1 an)
            </li>
            <li>
              <strong>Scopes requis:</strong>
              <ul className="ml-6 mt-1 space-y-1">
                <li>✅ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">read:user</code></li>
                <li>✅ <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">repo</code> (pour les contributions privées)</li>
              </ul>
            </li>
            <li>Cliquez sur <strong>"Generate token"</strong></li>
            <li>Copiez le token (vous ne le reverrez plus !)</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !token}
            >
              {isLoading ? 'Mise à jour...' : '🚀 Mettre à jour mes contributions'}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <details className="text-xs text-gray-600 dark:text-gray-400">
            <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
              ❓ Questions fréquentes
            </summary>
            <div className="mt-2 space-y-2 ml-4">
              <p>
                <strong>Q: Est-ce sécurisé ?</strong><br />
                R: Oui, le token est stocké de manière sécurisée dans Supabase avec RLS. Vous pouvez le révoquer à tout moment sur GitHub.
              </p>
              <p>
                <strong>Q: Pourquoi pas OAuth ?</strong><br />
                R: OAuth ne donne pas accès aux contributions privées, même avec tous les scopes.
              </p>
              <p>
                <strong>Q: Puis-je le supprimer ?</strong><br />
                R: Oui, à tout moment dans votre profil (feature à venir).
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}


