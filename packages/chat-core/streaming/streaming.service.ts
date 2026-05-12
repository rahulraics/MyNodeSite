import type { ChatTransport } from '../../chat-transports/transport.port.js'
import { parsePartialHtml } from './html-stream.parser.js'
import { sanitizeHtml } from './html-sanitizer.js'
import { ChunkAccumulator } from './chunk-accumulator.js'
import { ConversationService } from '../conversation/conversation.service.js'

export class StreamingService {
  private accumulator = new ChunkAccumulator()
  constructor(private transport: ChatTransport, private conversation: ConversationService, private sessionId: string) {}

  async startStream({ text, messageId }: { text: string; messageId: string }): Promise<void> {
    await this.transport.streamMessage?.({ text, sessionId: this.sessionId }, {
      onChunk: (chunk) => {
        const raw = this.accumulator.appendChunk(messageId, chunk)
        const parsed = parsePartialHtml(raw)
        const safe = sanitizeHtml(parsed)
        this.conversation.updateStreamingMessage(messageId, safe)
      },
      onComplete: () => { this.conversation.completeAssistantMessage(messageId); this.accumulator.clear(messageId) },
      onError: (error) => { this.conversation.failMessage(messageId, error.message); this.accumulator.clear(messageId) },
    })
  }
}
