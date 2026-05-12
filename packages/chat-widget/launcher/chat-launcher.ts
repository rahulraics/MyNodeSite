import { LitElement, html } from 'lit'
export class ChatLauncher extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<slot></slot>` } }
if (!customElements.get('chat-launcher')) customElements.define('chat-launcher', ChatLauncher)
