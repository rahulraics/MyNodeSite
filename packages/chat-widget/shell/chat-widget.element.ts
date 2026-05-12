import { LitElement } from 'lit'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import { ChatShell } from './chat-shell.js'

/**
 * Lit-based host web component so embedding apps can consume a standards-based custom element,
 * while the internal chat experience remains React.
 */
export class EmbeddedChatWidgetElement extends LitElement {
  private reactRoot?: Root

  createRenderRoot(): this {
    // Render into light DOM to simplify host-page CSS integration and webview compatibility.
    return this
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.reactRoot = createRoot(this)
    this.reactRoot.render(<ChatShell />)
  }

  disconnectedCallback(): void {
    this.reactRoot?.unmount()
    this.reactRoot = undefined
    super.disconnectedCallback()
  }
}

if (!customElements.get('embedded-chat-widget')) {
  customElements.define('embedded-chat-widget', EmbeddedChatWidgetElement)
}
