import React from 'react'
export function ChatLauncher({ isOpen, onToggle }: { isOpen: boolean; onToggle(): void }) { return <button onClick={onToggle}>{isOpen ? 'Close' : 'Chat'}</button> }
