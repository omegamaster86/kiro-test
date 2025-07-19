/**
 * @jest-environment node
 */

import { prisma } from '../prisma'

describe('Prisma Client', () => {
  it('should be defined and have the correct properties', () => {
    expect(prisma).toBeDefined()
    expect(prisma.todo).toBeDefined()
    expect(typeof prisma.todo.create).toBe('function')
    expect(typeof prisma.todo.findMany).toBe('function')
    expect(typeof prisma.todo.update).toBe('function')
    expect(typeof prisma.todo.delete).toBe('function')
  })

  it('should be a singleton instance', async () => {
    const { prisma: prisma2 } = await import('../prisma')
    expect(prisma).toBe(prisma2)
  })
})