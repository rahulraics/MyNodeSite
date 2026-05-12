import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { Message } from '../../chat-types/index.js'
import { ConversationStore } from '../../chat-core/state/conversation-store.js'
import { ConversationService } from '../../chat-core/conversation/conversation.service.js'
import { ChatController } from '../../chat-core/controllers/chat.controller.js'
import { SessionService } from '../../chat-core/session/session.service.js'
import { WidgetCacheStore } from '../../chat-storage/widget-cache/widget-cache.store.js'
import { RestTransport } from '../../chat-transports/rest/rest.transport.js'

export type ChatShellState = { isOpen: boolean; messages: Message[] }

export class ChatShellElement extends LitElement {
  createRenderRoot(): this { return this }
  private state: ChatShellState = { isOpen: false, messages: [] }
  private cache = new WidgetCacheStore()
  private store = new ConversationStore()
  private conversation = new ConversationService(this.store)
  private controller: ChatController | null = null
  private sessionId = 'session'

  connectedCallback(): void {
    super.connectedCallback()
    this.store.subscribe((messages) => { this.state = { ...this.state, messages }; this.requestUpdate() })
    this.boot()
  }

  async boot(): Promise<void> {
    const session = await new SessionService(this.cache).bootstrap()
    this.sessionId = session.sessionId
    this.state = { ...this.state, isOpen: session.isOpen }
    this.controller = new ChatController(new RestTransport(), this.conversation, session.sessionId)
    this.requestUpdate()
  }

  private toggle = (): void => {
    this.state = { ...this.state, isOpen: !this.state.isOpen }
    this.cache.save({ sessionId: this.sessionId, isOpen: this.state.isOpen, updatedAt: Date.now() })
    this.requestUpdate()
  }

  private onSend = async (ev: SubmitEvent): Promise<void> => {
    ev.preventDefault()
    const input = this.querySelector('input[data-composer]') as HTMLInputElement | null
    const text = input?.value.trim() ?? ''
    if (!text) return
    input!.value = ''
    await this.controller?.sendMessage(text)
  }

  render() {
    return html`<div>
      <button @click=${this.toggle}>${this.state.isOpen ? 'Close' : 'Chat'}</button>
      ${this.state.isOpen ? html`<section>
        <header><strong>Assistant</strong></header>
        <section>
          ${this.state.messages.map((m) => html`<div data-role=${m.role}>${m.role === 'assistant' ? unsafeHTML(m.content) : m.content}${m.status === 'streaming' ? '▍' : ''}</div>`)}
        </section>
        <small>AI can make mistakes. Verify critical information.</small>
        <form @submit=${this.onSend}><input data-composer /><button type='submit'>Send</button></form>
      </section>` : ''}
    </div>`
  }
}

if (!customElements.get('chat-shell')) customElements.define('chat-shell', ChatShellElement)
