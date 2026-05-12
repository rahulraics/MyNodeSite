import React, { useState } from 'react'

export type ComposerProps = { onSend(message: string): void }

export function Composer({ onSend }: ComposerProps) {
  const [text, setText] = useState('')
  return <form onSubmit={(e)=>{e.preventDefault(); if(text.trim()) onSend(text.trim()); setText('')}}><input value={text} onChange={(e)=>setText(e.target.value)} /><button type='submit'>Send</button></form>
}
