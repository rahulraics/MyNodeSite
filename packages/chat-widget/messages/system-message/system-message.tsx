import React from 'react'
import { CampfireBubble } from '../campfire-adapters.js'
import type { Message } from '../../../chat-types/index.js'
export const SystemMessage = ({ message }: { message: Message }) => <CampfireBubble role='system'>{message.content}</CampfireBubble>
