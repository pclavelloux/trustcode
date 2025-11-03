export interface GitHubUserData {
  username: string
  id: string
  avatar_url: string
  contributions: Record<string, number>
  totalContributions: number
}

export async function fetchGitHubContributions(
  username: string,
  token: string
): Promise<Record<string, number>> {
  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      throw new Error(`GitHub GraphQL error: ${JSON.stringify(data.errors)}`)
    }

    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks
    const contributions: Record<string, number> = {}

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions[day.date] = day.contributionCount
      })
    })

    return contributions
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    throw error
  }
}

export async function fetchGitHubUser(token: string): Promise<{
  username: string
  id: string
  avatar_url: string
}> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      username: data.login,
      id: data.id.toString(),
      avatar_url: data.avatar_url,
    }
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw error
  }
}

