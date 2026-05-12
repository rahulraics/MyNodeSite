import React from 'react'
import { CampfireBubble } from '../campfire-adapters.js'
import type { Message } from '../../../chat-types/index.js'
export const UserMessage = ({ message }: { message: Message }) => <CampfireBubble role='user'>{message.content}</CampfireBubble>
