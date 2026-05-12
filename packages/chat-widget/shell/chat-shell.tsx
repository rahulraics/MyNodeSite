import React, { useEffect, useMemo, useState } from 'react'
import type { Message } from '../../chat-types/index.js'
import { ChatLauncher } from '../launcher/chat-launcher.js'
import { ChatDialog } from '../dialog/chat-dialog.js'
import { ConversationStore } from '../../chat-core/state/conversation-store.js'
import { ConversationService } from '../../chat-core/conversation/conversation.service.js'
import { ChatController } from '../../chat-core/controllers/chat.controller.js'
import { SessionService } from '../../chat-core/session/session.service.js'
import { WidgetCacheStore } from '../../chat-storage/widget-cache/widget-cache.store.js'
import { RestTransport } from '../../chat-transports/rest/rest.transport.js'

export type ChatShellState = { isOpen: boolean; messages: Message[] }

export function ChatShell() {
  const [state, setState] = useState<ChatShellState>({ isOpen: false, messages: [] })
  const cache = useMemo(() => new WidgetCacheStore(), [])
  const store = useMemo(() => new ConversationStore(), [])
  const conversation = useMemo(() => new ConversationService(store), [store])
  const [controller, setController] = useState<ChatController | null>(null)

  useEffect(() => store.subscribe((messages) => setState((s) => ({ ...s, messages }))), [store])
  useEffect(() => { (async () => {
    const session = await new SessionService(cache).bootstrap()
    setState((s)=>({ ...s, isOpen: session.isOpen }))
    setController(new ChatController(new RestTransport(), conversation, session.sessionId))
  })() }, [cache, conversation])

  const onToggle = () => setState((s)=>{ const next = { ...s, isOpen: !s.isOpen }; if (controller) cache.save({ sessionId: 'session', isOpen: next.isOpen, updatedAt: Date.now() }); return next })

  return <div><ChatLauncher isOpen={state.isOpen} onToggle={onToggle} />{state.isOpen && <ChatDialog messages={state.messages} onSend={(text)=>controller?.sendMessage(text)} />}</div>
}
