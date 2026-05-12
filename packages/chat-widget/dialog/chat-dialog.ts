import { LitElement, html } from 'lit'
export class ChatDialog extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<slot></slot>` } }
if (!customElements.get('chat-dialog')) customElements.define('chat-dialog', ChatDialog)
