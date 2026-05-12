import { LitElement, html } from 'lit'
import './chat-shell.js'

export class EmbeddedChatWidgetElement extends LitElement {
  createRenderRoot(): this { return this }
  render() { return html`<chat-shell></chat-shell>` }
}

if (!customElements.get('embedded-chat-widget')) {
  customElements.define('embedded-chat-widget', EmbeddedChatWidgetElement)
}
