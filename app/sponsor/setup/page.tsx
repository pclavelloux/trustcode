'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SponsorSetupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    websiteUrl: '',
    companyName: '',
    description: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
    }
  }, [sessionId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit sponsor information')
      }

      // Rediriger vers la page d'accueil avec un message de succès
      router.push('/?sponsor=success')
    } catch (err) {
      console.error('Error submitting sponsor info:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2 ">
            🎉 Thank You for Your Sponsorship!
          </h1>
          <p className="text-base-content/70">
            Complete your sponsor profile to start promoting your product
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Company Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Your Company"
                  className="input input-bordered w-full text-gh-primary"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                  maxLength={255}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    This will be displayed as the sponsor name
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Website URL <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="input input-bordered w-full text-gh-primary"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Where should users be redirected when they click?
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 w-full text-gh-primary"
                  placeholder="Tell developers about your product..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength={200}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60 ">
                    {formData.description.length}/200 characters
                  </span>
                </label>
              </div>

              {error && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-end pt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full bg-gh-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-base-content/60">
          <p>
            Your sponsorship will be active immediately after submission.
            <br />
            You can manage your subscription anytime through your Stripe
            dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SponsorSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <SponsorSetupForm />
    </Suspense>
  )
}

