import React from 'react'
import type { Message } from '../../chat-types/index.js'
import { ChatHeader } from '../header/chat-header.js'
import { ConversationView } from '../conversation/conversation-view.js'
import { Disclaimer } from '../disclaimer/disclaimer.js'
import { Composer } from '../composer/composer.js'

export function ChatDialog({ messages, onSend }: { messages: Message[]; onSend(text: string): void }) {
  return <div><ChatHeader /><ConversationView messages={messages} /><Disclaimer /><Composer onSend={onSend} /></div>
}
