import type { WidgetCache } from '../../chat-types/index.js'

const KEY = 'chat_widget_cache'

export class WidgetCacheStore {
  constructor(private readonly ttlMs = 1000 * 60 * 60 * 4) {}
  load(): WidgetCache | null {
    const raw = globalThis.localStorage?.getItem(KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as WidgetCache
      if (Date.now() - parsed.updatedAt > this.ttlMs) { this.clear(); return null }
      return parsed
    } catch { this.clear(); return null }
  }
  save(cache: WidgetCache): void { globalThis.localStorage?.setItem(KEY, JSON.stringify(cache)) }
  clear(): void { globalThis.localStorage?.removeItem(KEY) }
}
