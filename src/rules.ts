import block from './blocklist.json'
import brands from './brands.json'

export type Risk = { level: 'ok' | 'warn' | 'block'; reason: string; details: string[] }

export function isBlockedDomain(host: string): boolean {
  return Boolean((block as Record<string, boolean>)[host])
}

export function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
  return dp[a.length][b.length]
}

export function looksLikeBrand(host: string): boolean {
  const h = host.toLowerCase()
  return (brands as { domain: string }[]).some(b => {
    const d = b.domain.toLowerCase()
    return h.includes(d) || editDistance(h, d) <= 2
  })
}

export function scoreUrl(href: string): Risk {
  const u = new URL(href)
  const host = u.hostname.toLowerCase()

  if (isBlockedDomain(host)) {
    return { level: 'block', reason: 'Known malicious domain', details: [] }
  }

  let score = 0
  const details: string[] = []

  if (host.startsWith('xn--')) { score += 3; details.push('Punycode domain') }
  if (looksLikeBrand(host)) { score += 3; details.push('Looks like known brand') }
  if (/(airdrop|bonus|double|claim)/i.test(u.pathname)) { score += 2; details.push('Bait words in URL') }
  if (host.split('.').length > 3) { score += 1; details.push('Deep subdomain') }

  if (score >= 5) return { level: 'warn', reason: 'Potential phishing signals detected', details }
  return { level: 'ok', reason: 'No clear risks', details }
}
