export function showBanner(reason: string, details: string[] = []) {
  if (document.getElementById('csb-banner')) return

  const div = document.createElement('div')
  div.id = 'csb-banner'
  div.style.cssText = `
    position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;
    background:#1f2937;color:white;padding:12px 14px;border-radius:12px;
    font:14px system-ui;box-shadow:0 4px 12px rgba(0,0,0,.2);
  `
  div.textContent = `⚠️ ${reason} — ${details.join(' · ')}`
  document.documentElement.appendChild(div)
}
