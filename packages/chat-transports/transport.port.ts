import type { Message, SendMessageRequest, StreamHandlers } from '../chat-types/index.js'

export interface ChatTransport {
  supportsStreaming(): boolean
  sendMessage(request: SendMessageRequest): Promise<Message>
  streamMessage?(request: SendMessageRequest, handlers: StreamHandlers): Promise<void>
}
