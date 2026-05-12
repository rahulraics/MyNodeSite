import { LitElement, html } from 'lit'
export class ConversationView extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<slot></slot>` } }
if (!customElements.get('conversation-view')) customElements.define('conversation-view', ConversationView)
