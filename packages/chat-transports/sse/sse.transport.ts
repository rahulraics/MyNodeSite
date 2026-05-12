import type { SendMessageRequest, StreamHandlers, Message } from '../../chat-types/index.js'
import type { ChatTransport } from '../transport.port.js'
import { mockBackend } from '../../testing/mocks/mock-backend.js'

export class SseTransport implements ChatTransport {
  supportsStreaming(): boolean { return true }

  async sendMessage(_request: SendMessageRequest): Promise<Message> {
    throw new Error('SSE transport uses streamMessage')
  }

  async streamMessage(request: SendMessageRequest, handlers: StreamHandlers): Promise<void> {
    try {
      for await (const chunk of mockBackend.streamAssistant(request.sessionId, request.text)) handlers.onChunk(chunk)
      handlers.onComplete()
    } catch (error) {
      handlers.onError(error as Error)
    }
  }
}
