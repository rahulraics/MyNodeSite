const TAG_RE = /<\/?([a-zA-Z][\w-]*)\b[^>]*>/g
const VOID = new Set(['br','hr','img','input','meta','link'])

export function parsePartialHtml(rawHtml: string): string {
  const openStack: string[] = []
  let m: RegExpExecArray | null
  while ((m = TAG_RE.exec(rawHtml))) {
    const token = m[0]; const tag = m[1].toLowerCase(); const closing = token.startsWith('</')
    if (VOID.has(tag)) continue
    if (!closing) openStack.push(tag)
    else { while (openStack.length && openStack[openStack.length - 1] !== tag) openStack.pop(); if (openStack.length) openStack.pop() }
  }
  return rawHtml + openStack.reverse().map((t) => `</${t}>`).join('')
}
