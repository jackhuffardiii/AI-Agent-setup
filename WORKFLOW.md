# Analytics project workflow

An analytics project succeeds when someone makes a better decision and trusts why. This is how I get there with Claude Code, from a question to a result I can defend and keep running.

Each stage names the skill that does the work, so this document stays about the order and the judgment. Skills link to the [repo's copies](skills/).

## The workflow at a glance

| Stage | Question it answers | Use | Done when |
| --- | --- | --- | --- |
| [1. Frame](#1-frame-the-decision) | What decision changes, and for whom? | [`brainstorm`](skills/personal/brainstorm) | A direction is chosen, and the rejected ones have reasons |
| [2. Scope](#2-scope-it-in-writing) | What exactly are we building? | [`project-intake`](skills/personal/project-intake) | The spec is approved |
| [3. Trust the data](#3-earn-trust-in-the-data) | Can this data support it? | [`sports-mle-workflow`](skills/personal/sports-mle-workflow) | The data contract is written and totals reconcile |
| [4. Set the test](#4-set-the-test-before-the-result) | What would count as working? | `sports-mle-workflow` | Tests and baselines are written down |
| [5. Build](#5-build-the-simplest-thing-that-could-work) | What's the simplest thing that could work? | [`ponytail`](skills/community/ponytail/ponytail), [`orchestration`](skills/community/fable-advisor/orchestration) | It runs from one command |
| [6. Attack](#6-try-to-break-it) | Why might this be wrong? | [`model-audit`](skills/personal/model-audit), [`ponytail-audit`](skills/community/ponytail/ponytail-audit) | Findings are fixed or disclosed |
| [7. Score once](#7-score-the-holdout-once) | Does it work on data it has never seen? | `sports-mle-workflow` | The result is recorded, good or bad |
| [8. Deliver](#8-deliver-the-decision) | Can the user act on it? | [`slide-craft`](skills/personal/slide-craft), my writing-voice skill | The user can use it without me in the room |
| [9. Keep it running](#9-keep-it-true) | Is it still right? | `sports-mle-workflow`, [`handoff`](skills/personal/handoff) | Refreshes are repeatable and predictions are tracked |

## Match the process to the work

Most work doesn't need all nine stages, and running them anyway is its own failure.

| Work | Example | Path |
| --- | --- | --- |
| **Quick question** | "Is this model split by handedness?" | Check the code or data and answer. |
| **Exploration** | A coach mentions an idea worth testing | Stage 1, then a small test. Stop if the idea doesn't hold up. |
| **Recurring report** | A pre-series opponent report | Build once through the full workflow, then write a project skill so each run is routine. |
| **Model or product** | A new grade or projection system | All nine stages. |
| **Hard deadline** | A questionnaire project | Stages 1, 3, 4, and 7 at minimum. Make the simple method airtight and name what you skipped. |

## 1. Frame the decision

Start with the person, not the data. Before any model exists, I want to be able to say who would act on this, what they'd do differently, and what a wrong answer would cost them.

- Go back to the roots: what do they want, what did they give us, and what do we already have?
- Take ideas from coaches and scouts seriously, then translate them into something testable. Their read on a player can point to something worth testing.
- Check what's possible before comparing options, so nobody falls in love with something the data can't support.
- "Don't do this" is a good result. It's the cheapest one a project can produce.

## 2. Scope it in writing

For anything bigger than a small test, write down the plan before writing code. The spec records scope, what's deferred, each assumption, and how it will be built. Stable IDs let me change one decision with one line, such as "A2 should be X."

Decide here who has to be able to explain the result. If I'll be defending it in an interview or to a coach, the method I can explain beats the method that scores slightly better, and I run and walk through that code myself.

## 3. Earn trust in the data

Many of the costliest mistakes I've run into started here, and they often don't throw errors. A blank ID can produce a complete, clean, empty report. Treat every source as wrong until it's been checked.

- **Reconcile totals.** Totals in the output should match a count from the source. If the plate appearances on a report don't equal their parts, stop.
- **Check grain before joining.** Know what one row means and whether the table is split the way the plan assumes. Look for duplicate rows after each join.
- **Join on IDs, not names.** Then check that names and bio fields agree, because the same player can appear under two names.
- **Check labels against reality.** Compare team, role, and handedness with an outside source. Transactions by date beat a roster field that may be stale.
- **Check coverage by season and level.** A feature missing from recent years breaks the exact snapshot you need to predict on.
- **Look for measurement breaks.** Hardware, vendor, ball, and rule changes can shift a feature without any change in the players.

## 4. Set the test before the result

Decide what counts as success while I still don't know the answer. Afterward, it's too easy to find a reason that a result is fine.

Write these down, in a file like `TESTS.md` when there's more than one:

- **The holdout.** Which seasons, and the rule that nothing touches them until every modeling decision is done.
- **The baseline.** The simple thing the model has to beat, such as last season's value or a public metric.
- **The metric.** Chosen by the decision, not by habit. A ranking problem gets judged on ranking, even if the model trains on something else.
- **The gates.** What would make me ship it and what would make me stop.
- **The null check.** Run the selection rule on shuffled labels or pure noise. If noise passes, the rule can't tell a real effect from luck.
- **The power check.** Before spending a one-shot test, plant effects of known sizes and confirm the pipeline can find them. Some tests aren't worth running on the sample available.

## 5. Build the simplest thing that could work

Build up from the baseline, and add complexity only when error analysis gives a reason. Shrinkage toward a sensible prior solves a lot of sports problems on its own.

- **Keep the code readable.** Someone else on staff should be able to follow it. That means plain names, no unexplained jargon, and no clutter. If I can't explain a line, it doesn't stay.
- **Keep constants in one place.** Hardcoded numbers scattered through a pipeline go stale without anyone noticing.
- **Make it rebuildable.** One command, in a documented order, from raw data to final output.
- **Cache slow fits by fingerprint.** Then a change to the inputs forces a refit, and nothing else does.
- **Use agents with a written spec.** Cheaper models can write well-specified pieces, and each one still gets reviewed. The decisions about the model stay with me.

### Delegated builds: brief, check, review

When the build splits into pieces that don't touch the same files, Opus runs it as a loop instead of writing everything itself, using [`orchestration`](skills/community/fable-advisor/orchestration) and the Workflow tool.

1. **Brief.** Opus splits the approved spec into briefs. Each brief has one goal, the files it may touch, its inputs and outputs, and the check that proves it's done. A worker shouldn't have to guess.
2. **Build.** Workers run on Sonnet by default. Haiku only gets mechanical jobs like renames, formatting, and boilerplate tests. Anything that touches joins, splits, or model logic gets Sonnet or Opus.
3. **Check each piece.** A check has to be able to fail, so it runs the tests from `TESTS.md` and compares the diff against the brief. A failure goes back to the worker with the error. After two failed retries, the piece goes to Opus.
4. **Opus review.** Opus reads the whole diff against the spec, then runs `model-audit` on modeling code and [`ponytail-review`](skills/community/ponytail/ponytail-review) for bloat.
5. **I approve.** Nothing merges until I've read the review.

Keep it to two to four workers. Past that, each worker spends more time re-learning the project than it saves.

## 6. Try to break it

Good numbers aren't enough, because a model can score well for the wrong reasons. This is the stage that protects my credibility.

**Look at it first.** Plot the output and read the names at the top and bottom. Does the ordering make sense to someone who knows the sport?

**Treat "this feels wrong" as a finding.** If a result contradicts what the sport says should be true, dig until there's a reason. Sometimes it's a bug, sometimes it's the wrong comparison, and sometimes the intuition is what needs to change. All three are worth knowing.

**Then get systematic:**

- Run `model-audit` for leakage, splits, calibration, drift, and sample size.
- Compare to public metrics, and explain the gap instead of tuning it away.
- Check whether fine-grained results agree with the overall ones. Parts should sum to the whole.
- Diagnose by segment when the overall result looks off. An average can hide two opposite errors.
- Sort the biggest misses into bugs, thin samples, and real changes in the player.
- Run `ponytail-audit` on the code, to cut what isn't earning its place.

If a problem can't be fixed, disclose it. A documented limitation is much easier to defend than one somebody else finds.

## 7. Score the holdout once

Run the holdout once, after everything is frozen, and record the result whether it's good or bad.

If it disappoints, resist the urge to adjust and re-score, because then it's no longer a holdout. Diagnose with cross-validation on the training years, and pick any fix from that evidence. Any later change has to be judged on data that hasn't been touched, even if that means waiting for new games.

Say what the result means in practice, including the interval around it. If the sample is too small to conclude anything, say that plainly.

## 8. Deliver the decision

Nobody uses a model. They use a report, a card, a page, or a conversation with me.

- **Show the player, not the method.** Lead with the data and the decision. Put methodology behind a link or in an appendix.
- **Remove anything that doesn't help.** If a visual needs explaining or a line just decorates the page, cut it.
- **Show sample size and data-through date** next to the numbers.
- **Test the plain-English version.** Can I explain it to a teammate in the simplest possible terms? If not, I don't understand it well enough yet.
- **Build talks with `slide-craft`,** and write anything I'll send or publish in my own voice.
- **Open a PR before a site goes live,** so what's deployed always matches what was reviewed.

Team data, internal grades, and medical information stay out of public repos and examples.

## 9. Keep it true

The project isn't finished when it ships. The sport changes, the data changes, and people start acting on the model.

- **Refit downstream.** When a base model changes, rebuild what's built on it in order, then re-measure any pinned constants and test bands.
- **Log predictions before the outcome is known,** then score them as results arrive. That's the most honest test there is.
- **Check inputs before each refresh:** row counts, new or missing IDs, null rates, and feature distributions.
- **Turn repeat work into a skill.** Recurring reports get a project skill and a symptom-to-fix table, so the next run doesn't start from zero.
- **Save hard-won lessons.** When something costs real time, write it down where the next session will read it. Fold repeated lessons into a shared skill like `model-audit`.

## Working across sessions

Long sessions get expensive and start to drift, so I keep the project's memory in the repo rather than in the conversation.

| File | What it holds |
| --- | --- |
| `<slug>-spec.md` | The plan and its stable IDs, updated whenever the build changes it |
| `TESTS.md` | Tests declared in advance and their results, including failures |
| `HANDOFF.md` | Current state, decisions not to relitigate, what was ruled out, and next steps |
| `<folder-name>.md` or `MEMORY.md` | Known traps and project rules |

The [auto-handoff mod](mods/auto-handoff) triggers `handoff` at 300k tokens, and a fresh session picks up from there.

## Rules that always apply

1. **Never report a number from memory.** Re-run it or mark it unverified.
2. **Never invent a metric, a result, or an experience.**
3. **Keep the holdout untouched** until the end, and split by time and by player.
4. **Say when a sample is too small,** and show the sample next to the number.
5. **Own the limitations** before anyone has to ask.
6. **I have to be able to explain every result.** Claude can do the work, but the conclusion is mine to defend.
