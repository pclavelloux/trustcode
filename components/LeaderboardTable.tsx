'use client'

import { User } from '@/types/user'
import ContributionGrid from './ContributionGrid'
import Image from 'next/image'
import Link from 'next/link'

interface LeaderboardTableProps {
  users: User[]
  currentUserGithubUsername?: string
}

export default function LeaderboardTable({ users, currentUserGithubUsername }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div
          key={user.id}
          className={`group bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden transition-all hover:border-[#30363d] ${
            user.github_username === currentUserGithubUsername
              ? 'ring-2 ring-[#26a641] border-[#26a641]'
              : ''
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 p-4 lg:p-6">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              {/* Rank Position */}
              <div className="flex-shrink-0 w-10 lg:w-12">
                <div className="flex items-center justify-center">
                  {index < 3 ? (
                    <span className="text-xl lg:text-2xl font-bold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-lg lg:text-xl font-bold text-gray-500">
                      #{index + 1}
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.display_username || user.github_username}
                  width={48}
                  height={48}
                  className="lg:w-14 lg:h-14 rounded-full border-2 border-[#30363d]"
                />
              </div>

              {/* Username */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2 flex-wrap">
                  <Link
                    href={`https://github.com/${user.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg lg:text-xl font-semibold text-gray-100 hover:text-[#58a6ff] transition-colors truncate"
                  >
                    {user.display_username || user.github_username}
                  </Link>
                  {user.github_username === currentUserGithubUsername && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-[#1f6feb] text-white rounded-full flex-shrink-0">
                      You
                    </span>
                  )}
                </div>
                <Link
                  href={`https://github.com/${user.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs lg:text-sm text-gray-400 hover:text-[#58a6ff] transition-colors"
                >
                  @{user.github_username}
                </Link>
              </div>
            </div>

            {/* Total Contributions */}
            <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-0">
              <div className="flex-shrink-0 text-left lg:text-right">
                <div className="text-2xl lg:text-3xl font-bold text-[#39d353] mb-0.5 lg:mb-1">
                  {user.total_contributions.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Contributions
                </div>
              </div>

              {/* Contribution Graph - Desktop */}
              <div className="hidden lg:block flex-shrink-0 w-[350px] xl:w-[400px]">
                <ContributionGrid
                  contributionsData={user.contributions_data || {}}
                  username={user.github_username}
                  compact={true}
                />
              </div>
            </div>

            {/* Contribution Graph - Mobile/Tablet */}
            <div className="lg:hidden">
              <ContributionGrid
                contributionsData={user.contributions_data || {}}
                username={user.github_username}
                compact={true}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

