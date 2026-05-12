export class ChunkAccumulator {
  private readonly buffers = new Map<string, string>()
  appendChunk(messageId: string, chunk: string): string {
    const next = `${this.buffers.get(messageId) ?? ''}${chunk}`
    this.buffers.set(messageId, next)
    return next
  }
  clear(messageId: string): void { this.buffers.delete(messageId) }
}
