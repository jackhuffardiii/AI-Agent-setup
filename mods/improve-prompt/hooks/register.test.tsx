import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'improve-prompt',
  component: 'AbovePrompt',
  surface: 'desktop',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 5,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 5 },
    view: {},
  },
} as const

test('asks the clarifying question, then replaces the draft with the rewrite', async ($, on) => {
  const prompts: string[] = []
  let markFilled = (_: string) => {}
  const filled = new Promise<string>(resolve => (markFilled = resolve))

  // The press only schedules the work (the click has a 10s budget); the timer runs it.
  on('clock.after', () => ({ value: undefined }))
  on('prompt.read', () => ({ value: { text: 'make a chart', cursor: 0 } }))
  on('model.fork', (_, e) => {
    prompts.push(e.prompt)
    const text = prompts.length === 1
      ? '{"questions":[{"question":"Which data?","header":"Data","options":["Pitching","Hitting"]}]}'
      : 'Build a pitching chart.'
    const usage = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
    return { value: { isAnswered: true as const, text, usage } }
  })
  on('tool.call', (_, e) =>
    e.tool === 'AskUserQuestion'
      ? { result: { questions: e.questions, answers: { 'Which data?': 'Pitching' } } }
      : { result: {} },
  )
  on('prompt.fill', (_, e) => {
    markFilled(e.text)
    return { isFilled: true }
  })

  const ui = await $.ui.mount(BAND)
  await ui.press({ key: 'improve' })

  expect(await filled).toBe('Build a pitching chart.')
  expect(prompts[1]).toContain('A: Pitching')
  await ui.unmount()
})
