import type { Message } from '../../chat-types/index.js'
import { ConversationStore } from '../state/conversation-store.js'

export class ConversationService {
  constructor(private readonly store: ConversationStore) {}
  addUserMessage(content: string): Message { const m={id:id('user'),role:'user' as const,content,status:'complete' as const}; this.store.update((s)=>[...s,m]); return m }
  createStreamingMessage(): Message { const m={id:id('asst'),role:'assistant' as const,content:'',status:'streaming' as const}; this.store.update((s)=>[...s,m]); return m }
  updateStreamingMessage(messageId: string, content: string): void { this.store.update((s)=>s.map((m)=>m.id===messageId?{...m,content,status:'streaming'}:m)) }
  completeAssistantMessage(messageId: string, content?: string): void { this.store.update((s)=>s.map((m)=>m.id===messageId?{...m,content:content??m.content,status:'complete'}:m)) }
  failMessage(messageId: string, error = 'Failed to generate response'): void { this.store.update((s)=>s.map((m)=>m.id===messageId?{...m,content:error,status:'error'}:m)) }
}
const id=(p:string)=>`${p}_${Math.random().toString(36).slice(2,10)}`
