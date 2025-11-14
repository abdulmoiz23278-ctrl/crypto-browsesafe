import { guardEthereum } from './walletGuard'
import { scoreUrl } from './rules'
import { showBanner } from './ui'

;(function main() {
  guardEthereum()
  try {
    const risk = scoreUrl(location.href)
    if (risk.level === 'warn') showBanner(risk.reason, risk.details)
  } catch (err) {
    console.warn('SafeBrowse check error', err)
  }
})()
