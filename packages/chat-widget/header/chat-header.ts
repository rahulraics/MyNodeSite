import { LitElement, html } from 'lit'
export class ChatHeader extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<header><slot></slot></header>` } }
if (!customElements.get('chat-header')) customElements.define('chat-header', ChatHeader)
