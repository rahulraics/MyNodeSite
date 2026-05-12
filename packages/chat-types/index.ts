export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error'

export type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status: MessageStatus
}

export type SendMessageRequest = {
  text: string
  sessionId: string
}

export type StreamHandlers = {
  onChunk(chunk: string): void
  onComplete(): void
  onError(error: Error): void
}

export type WidgetCache = {
  sessionId: string
  isOpen: boolean
  updatedAt: number
}

export type ConversationSnapshot = {
  sessionId: string
  messages: Message[]
}
