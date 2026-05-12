import { WidgetCacheStore } from '../../chat-storage/widget-cache/widget-cache.store.js'
import { mockBackend } from '../../testing/mocks/mock-backend.js'

export class SessionService {
  constructor(private cache: WidgetCacheStore) {}
  async bootstrap(): Promise<{ sessionId: string; isOpen: boolean }> {
    const cached = this.cache.load()
    const snapshot = await mockBackend.getSession(cached?.sessionId)
    if (!cached || cached.sessionId !== snapshot.sessionId) this.cache.clear()
    return { sessionId: snapshot.sessionId, isOpen: cached?.sessionId === snapshot.sessionId ? cached.isOpen : false }
  }
}
