import type { ConversationSnapshot } from '../../chat-types/index.js'

const sessions = new Map<string, ConversationSnapshot>()

export const mockBackend = {
  async getSession(sessionId?: string): Promise<ConversationSnapshot> {
    await delay(60)
    const id = sessionId && sessions.has(sessionId) ? sessionId : `sess_${Math.random().toString(36).slice(2, 10)}`
    if (!sessions.has(id)) sessions.set(id, { sessionId: id, messages: [] })
    return structuredClone(sessions.get(id)!)
  },

  async appendUserAndAssistant(sessionId: string, userText: string): Promise<string> {
    await delay(450)
    const html = `<div><p>Hello world</p><ul><li>React</li><li>Vue</li></ul><p>You said: ${escapeHtml(userText)}</p></div>`
    return html
  },

  async *streamAssistant(sessionId: string, userText: string): AsyncGenerator<string> {
    const chunks = ['<div><p>Hel', 'lo world</p><ul><li>React', '</li><li>Vue</li></ul><p>You said: ', escapeHtml(userText), '</p></div><script>alert(1)</script>']
    for (const chunk of chunks) {
      await delay(120)
      yield chunk
    }
  },
}

function delay(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)) }
function escapeHtml(s: string): string { return s.replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c)) }
