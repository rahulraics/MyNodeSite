import type { Message } from '../../chat-types/index.js'

type Listener = (messages: Message[]) => void

export class ConversationStore {
  private messages: Message[] = []
  private listeners = new Set<Listener>()

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.messages)
    return () => this.listeners.delete(listener)
  }

  setMessages(messages: Message[]): void { this.messages = messages; this.emit() }
  getMessages(): Message[] { return this.messages }

  update(updater: (messages: Message[]) => Message[]): void { this.messages = updater(this.messages); this.emit() }

  private emit(): void { for (const listener of this.listeners) listener(this.messages) }
}
