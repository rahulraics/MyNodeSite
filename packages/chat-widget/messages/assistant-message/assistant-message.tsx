import React from 'react'
import { CampfireBubble } from '../campfire-adapters.js'
import type { Message } from '../../../chat-types/index.js'
export const AssistantMessage = ({ message }: { message: Message }) => <CampfireBubble role='assistant'><span dangerouslySetInnerHTML={{ __html: message.content }} />{message.status==='streaming' ? '▍' : ''}</CampfireBubble>
