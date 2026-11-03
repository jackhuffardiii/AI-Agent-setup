import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

export const THRESHOLD = 300_000
// After /clear or /compact drops the window below this, the trigger re-arms.
export const REARM = 150_000

const hasFired = atom({ plugin: 'auto-handoff', key: 'hasFired' } as const, false)

export const handoffPrompt = (tokens: number) =>
  `Context is at ${Math.round(tokens / 1000)}k tokens (handoff threshold ${THRESHOLD / 1000}k). ` +
  'Use the handoff skill now: write HANDOFF.md, record this session\'s potholes in the project memory, ' +
  'and give me the kickoff prompt for a fresh session. Do not start new work first.'

export const register: Register = on => {
  on('session.measure', async ($, e, next) => {
    const result = await next(e)
    const tokens = e.context.tokens
    if (tokens === undefined || !e.changed.includes('context')) return result

    const isFired = await read($, hasFired)
    if (isFired && tokens < REARM) {
      await update($, hasFired, () => false)
      return result
    }
    if (isFired || tokens < THRESHOLD) return result

    await update($, hasFired, () => true)
    $.ui.toast(`Context at ${Math.round(tokens / 1000)}k: handing off after this turn`, { timeoutMs: 10_000 })
    // A plugin's prompt waits until the session is idle, so the current turn finishes first.
    $.prompt.submit({ text: handoffPrompt(tokens) }).catch(() => update($, hasFired, () => false))
    return result
  })
}
