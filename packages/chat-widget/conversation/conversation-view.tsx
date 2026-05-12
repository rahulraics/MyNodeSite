import React, { memo } from 'react'
import type { Message } from '../../chat-types/index.js'
import { AssistantMessage } from '../messages/assistant-message/assistant-message.js'
import { UserMessage } from '../messages/user-message/user-message.js'
import { SystemMessage } from '../messages/system-message/system-message.js'

const Row = memo(({ message }: { message: Message }) => {
  if (message.role === 'assistant') return <AssistantMessage message={message} />
  if (message.role === 'system') return <SystemMessage message={message} />
  return <UserMessage message={message} />
})

export const ConversationView = memo(({ messages }: { messages: Message[] }) => <section>{messages.map((m) => <Row key={m.id} message={m} />)}</section>)
