import { LitElement, html } from 'lit'
export class CampfireBubble extends LitElement { createRenderRoot(): this { return this }; render(){ return html`<div><slot></slot></div>` } }
if (!customElements.get('campfire-bubble')) customElements.define('campfire-bubble', CampfireBubble)
