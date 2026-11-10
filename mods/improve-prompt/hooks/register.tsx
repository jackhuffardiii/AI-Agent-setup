import type { EngineInterface, Register } from 'claude-code'

type Question = { question: string; header: string; options: string[] }

const QUESTIONS_PROMPT = (draft: string) => `The user is about to send this prompt to a coding assistant:

<draft>
${draft}
</draft>

Work out what they are really trying to get done. List the 1-3 clarifying questions whose answers would most change how the prompt should be written (scope, output format, constraints, what "done" looks like). Skip anything the draft or conversation already answers. Each question gets 2-4 short answer options.

Reply with JSON only, no prose:
{"questions":[{"question":"...?","header":"max 12 chars","options":["...","..."]}]}`

const REWRITE_PROMPT = (draft: string, answers: string) => `Rewrite this prompt so a coding assistant gets exactly what the user wants on the first try.

<draft>
${draft}
</draft>

<clarifications>
${answers || '(none)'}
</clarifications>

Keep the user's intent and voice. State the goal first, then context, constraints, and what done looks like. Be concise: no filler, no invented requirements. Reply with the rewritten prompt only.`

let isBusy = false

// Use this session's conversation as context when there is one; else a fresh call.
async function askModel($: EngineInterface, prompt: string) {
  const forked = await $.model.fork({ prompt, effort: 'low' })
  if (forked.isAnswered) return forked.text
  if (forked.reason !== 'nothing-to-fork') return undefined
  const fresh = await $.model.complete({ model: 'sonnet', prompt, maxTokens: 2048 })
  return fresh.isAnswered ? fresh.text : undefined
}

async function improve($: EngineInterface) {
  const { text: draft } = await $.prompt.read()
  if (!draft.trim()) return $.ui.toast('Type a prompt first')
  if (isBusy) return
  isBusy = true

  try {
    $.ui.status('Improving prompt: reading it…')
    const raw = await askModel($, QUESTIONS_PROMPT(draft))
    const json = raw?.match(/\{[\s\S]*\}/)?.[0]
    const questions: Question[] = json ? JSON.parse(json).questions ?? [] : []

    const answers: string[] = []
    for (const q of questions.slice(0, 3)) {
      const answer = await $.ui.ask(q.question, { header: q.header.slice(0, 12), options: q.options.slice(0, 4) })
      answers.push(`Q: ${q.question}\nA: ${answer}`)
    }

    $.ui.status('Improving prompt: rewriting…')
    const rewritten = await askModel($, REWRITE_PROMPT(draft, answers.join('\n\n')))
    if (!rewritten) return $.ui.toast('Could not rewrite the prompt')

    await $.prompt.fill({ text: rewritten.trim(), mode: 'replace' })
    $.ui.toast('Prompt improved. Review it, then send.')
  } catch {
    // A dismissed question dialog rejects: treat it as cancel and leave the draft alone.
    $.ui.toast('Improve Prompt cancelled')
  } finally {
    isBusy = false
    $.ui.status(undefined)
  }
}

export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button } = $.ui.resolve(e)

    return (
      // Button hover needs a keyed Box around it; it restyles the label only (no whole-button fill on desktop).
      <Box key="improve-band">
        <Button key="improve" label="Improve Prompt" hover={{ backgroundColor: '#B5541C' }} onPress={() => { $.clock.after(0, () => void improve($)) }} />
      </Box>
    )
  })
}
