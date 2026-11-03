import { expect, test } from 'claude-code/testing'

const measure = (tokens: number) => ({
  context: { tokens, window: 1_000_000 },
  rateLimits: [],
  changed: ['context' as const],
})

test('fires once at 300k, stays quiet above it, re-arms after the window drops', async ($, on) => {
  const prompts: string[] = []
  const toasts: string[] = []
  on('session.measure', (_$, e) => ({ changed: e.changed }))
  on('prompt.submit', (_$, e) => {
    prompts.push(e.text)
    return { text: e.text }
  })
  on('ui.toast', (_$, e) => {
    toasts.push(e.text)
  })
  const settle = () => new Promise(r => setTimeout(r, 0))

  await $.session.measure(measure(250_000))
  await settle()
  expect(prompts.length).toBe(0)

  await $.session.measure(measure(305_000))
  await settle()
  expect(prompts.length).toBe(1)
  expect(prompts[0]).toContain('handoff skill')
  expect(prompts[0]).toContain('305k')
  expect(toasts.length).toBe(1)

  await $.session.measure(measure(400_000))
  await settle()
  expect(prompts.length).toBe(1)

  // /clear: window drops, trigger re-arms
  await $.session.measure(measure(40_000))
  await $.session.measure(measure(310_000))
  await settle()
  expect(prompts.length).toBe(2)
})
