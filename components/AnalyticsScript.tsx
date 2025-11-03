'use client'

import { useEffect } from 'react'

export default function AnalyticsScript() {
  useEffect(() => {
    // Vérifier si on est en production (pas localhost)
    const isProduction = 
      typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.startsWith('192.168.') &&
      !window.location.hostname.startsWith('10.') &&
      window.location.hostname !== ''

    if (isProduction) {
      // Créer et ajouter le script
      const script = document.createElement('script')
      script.defer = true
      script.setAttribute('data-website-id', 'dfid_JxxcKwabSgMwHvhFgsWhF')
      script.setAttribute('data-domain', 'olympicship.com')
      script.src = 'https://datafa.st/js/script.js'
      document.head.appendChild(script)

      // Nettoyage si le composant est démonté (théoriquement ne devrait pas arriver)
      return () => {
        const existingScript = document.querySelector('script[data-website-id="dfid_JxxcKwabSgMwHvhFgsWhF"]')
        if (existingScript) {
          document.head.removeChild(existingScript)
        }
      }
    }
  }, [])

  return null
}

