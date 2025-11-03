'use client'

import { Megaphone } from 'lucide-react'

interface Sponsor {
  id: string
  name: string
  description: string
  icon?: React.ReactNode
  backgroundColor?: string
  iconColor?: string
  url?: string
}

interface SponsorPanelProps {
  sponsors: (Sponsor | null)[]
}

// Helper function to generate simple icon based on sponsor name
const generateIcon = (name: string, iconColor: string) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold "
      style={{
        color: iconColor,
        backgroundColor: 'transparent',
      }}
    >
      {initials}
    </div>
  )
}

export default function SponsorPanel({ sponsors }: SponsorPanelProps) {
  return (
    <div className="space-y-4 sticky top-4 min-w-0">
      {sponsors.map((sponsor, index) => {
        if (!sponsor) {
          // Empty ad spot
          return (
            <div
              key={`empty-${index}`}
              className="card bg-base-100 border-2 border-dashed border-base-300 hover:border-primary transition-all duration-300 cursor-pointer group shadow-lg rounded-gh"
            >
              <div className="card-body p-4">
                <div className="flex items-start gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-base-200 text-base-content rounded-gh w-12 h-12">
                      <Megaphone className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors text-sm mb-1">
                      Promote your product here!
                    </h3>
                    <p className="text-xs text-base-content/60">
                      Get your product in front of top developers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        const icon = sponsor.icon || generateIcon(sponsor.name, sponsor.iconColor || '#58a6ff')

        const content = (
          <div className="card bg-base-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group border border-base-300 rounded-gh">
            <div className="card-body p-4">
              <div className="flex items-start gap-3">
                <div className="avatar placeholder">
                  <div
                    className="rounded-gh w-12 h-12 flex items-center justify-center"
                    style={{
                      backgroundColor: sponsor.backgroundColor || '#21262d',
                    }}
                  >
                    {icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors text-sm mb-1">
                    {sponsor.name}
                  </h3>
                  <p className="text-xs text-base-content/70 line-clamp-3 leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

        if (sponsor.url) {
          return (
            <a
              key={sponsor.id}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {content}
            </a>
          )
        }

        return <div key={sponsor.id}>{content}</div>
      })}
    </div>
  )
}

