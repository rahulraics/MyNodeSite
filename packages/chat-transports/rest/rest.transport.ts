import type { Message, SendMessageRequest } from '../../chat-types/index.js'
import type { ChatTransport } from '../transport.port.js'
import { mockBackend } from '../../testing/mocks/mock-backend.js'

export class RestTransport implements ChatTransport {
  supportsStreaming(): boolean { return false }

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    const html = await mockBackend.appendUserAndAssistant(request.sessionId, request.text)
    return { id: `asst_${Date.now()}`, role: 'assistant', content: html, status: 'complete' }
  }
}
