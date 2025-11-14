import { showBanner } from './ui'

export function guardEthereum() {
  const w = window as any
  const eth = w.ethereum
  if (!eth || eth.__csbGuarded) return

  const orig = eth.request.bind(eth)
  eth.request = async (args: { method: string; params?: any[] }) => {
    const m = (args?.method || '').toLowerCase()

    if (m === 'eth_sign' || m === 'personal_sign') {
      showBanner('Raw signature detected', ['This can authorize actions off-site'])
      throw new Error('Blocked by Crypto SafeBrowse')
    }

    return orig(args)
  }

  eth.__csbGuarded = true
}
