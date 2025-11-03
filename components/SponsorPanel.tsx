'use client'

import { useState, useEffect } from 'react'
import { Megaphone } from 'lucide-react'

interface Sponsor {
  id: string
  email: string
  company_name: string
  description: string | null
  website_url: string
  status: string
}

// Helper function to generate simple icon based on sponsor name
const generateIcon = (name: string) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-full h-full rounded-gh flex items-center justify-center text-lg font-bold bg-primary/20 text-primary">
      {initials}
    </div>
  )
}

export default function SponsorPanel() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchSponsor()
  }, [])

  const fetchSponsor = async () => {
    try {
      const response = await fetch('/api/sponsors')
      if (response.ok) {
        const data = await response.json()
        setSponsor(data.sponsor)
      }
    } catch (error) {
      console.error('Error fetching sponsor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSponsorClick = async () => {
    if (checkoutLoading) return

    setCheckoutLoading(true)

    try {
      const response = await fetch('/api/sponsors/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sticky top-4 min-w-0">
        <div className="card bg-base-100 shadow-lg rounded-gh">
          <div className="card-body p-4">
            <div className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sticky top-4 min-w-0">
      {sponsor ? (
        // Active sponsor
        <a
          href={sponsor.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="card bg-base-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group border border-base-300 rounded-gh">
            <div className="card-body p-4">
              <div className="flex items-start gap-3">
                <div className="avatar placeholder">
                  <div className="rounded-gh w-12 h-12 flex items-center justify-center overflow-hidden">
                    {generateIcon(sponsor.company_name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors text-sm mb-1">
                    {sponsor.company_name}
                  </h3>
                  {sponsor.description && (
                    <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                      {sponsor.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </a>
      ) : (
        // Empty sponsor slot - call to action
        <div
          onClick={handleSponsorClick}
          className="card bg-base-100 border-2 border-dashed border-base-300 hover:border-primary transition-all duration-300 cursor-pointer group shadow-lg rounded-gh"
        >
          <div className="card-body p-4">
            <div className="flex items-start gap-3">
              <div className="avatar placeholder">
                <div className="bg-base-200 text-base-content rounded-gh w-12 h-12 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors text-sm mb-1">
                  {checkoutLoading ? 'Loading...' : 'Promote your product here!'}
                </h3>
                <p className="text-xs text-base-content/60">
                  {checkoutLoading
                    ? 'Redirecting to checkout...'
                    : '€99/month - Get your product in front of top developers'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

