import { LitElement, html } from 'lit'
export class DisclaimerBlock extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<small><slot></slot></small>` } }
if (!customElements.get('chat-disclaimer')) customElements.define('chat-disclaimer', DisclaimerBlock)
