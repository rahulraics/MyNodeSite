import type { ChatTransport } from '../../chat-transports/transport.port.js'
import { ConversationService } from '../conversation/conversation.service.js'
import { StreamingService } from '../streaming/streaming.service.js'

export class ChatController {
  private streaming: StreamingService
  constructor(private transport: ChatTransport, private conversation: ConversationService, private sessionId: string) {
    this.streaming = new StreamingService(transport, conversation, sessionId)
  }

  async sendMessage(text: string): Promise<void> {
    this.conversation.addUserMessage(text)
    const assistant = this.conversation.createStreamingMessage()

    if (this.transport.supportsStreaming()) {
      await this.streaming.startStream({ text, messageId: assistant.id })
      return
    }

    try {
      const response = await this.transport.sendMessage({ text, sessionId: this.sessionId })
      this.conversation.completeAssistantMessage(assistant.id, response.content)
    } catch (error) {
      this.conversation.failMessage(assistant.id, (error as Error).message)
    }
  }
}
