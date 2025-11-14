export const store = {
  async get<T>(key: string, fallback: T): Promise<T> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => {
        resolve((res?.[key] as T) ?? fallback)
      })
    })
  },
  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve())
    })
  }
}
