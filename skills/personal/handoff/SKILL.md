---
name: handoff
description: Hand the current session off to a fresh one, or pick up from a previous handoff. Use when Jack says "handoff", "hand this off", "wrap up", "fresh session", "start clean", "context is getting long", "save where we are", or at the start of a session when he says "pick up from the handoff", "continue from HANDOFF.md", "where did we leave off". Also suggest it yourself when a session has run long (many turns, big outputs, or past ~300k tokens; the auto-handoff mod also triggers this at 300k) and the next chunk of work is separable.
---

# Handoff

A fresh session that reads a good handoff is cheaper and sharper than a long one: every turn of a long session re-reads the whole history. The handoff file carries what the next session needs and nothing else.

## Mode 1: Write the handoff

1. **Location**: `HANDOFF.md` at the project root (git root if there is one, else the working directory). If one exists, read it first: carry forward anything still true, drop what's done. Overwrite it; git keeps the history.
2. **Verify before writing.** Don't record "tests pass", "model AUC 0.71", or "PR merged" from memory. Re-run or re-check anything cheap to confirm. Mark anything unverified as `(unverified)`.
3. **Write it using the template below.** Keep it under ~80 lines. Point to files instead of pasting code. Never include credentials, tokens, or connection strings.
4. **Record potholes in project memory.** List what cost real time this session and would bite again: wrong assumptions about data or schema, stale paths, commands or packages that failed and what fixed them, approaches that looked right and weren't, corrections Jack had to make. Skip one-off typos and anything already recorded.
   - Where: the project's `MEMORY.md` if it has one, else a `## Pitfalls` section at the end of the project `CLAUDE.md` (create the section if missing). In the Obsidian vault, follow its own CLAUDE.md protocol instead.
   - Format: one line each, `- YYYY-MM-DD: <trap> → <what to do instead>`. At most 5 per session. Before adding, scan the existing list and merge or update rather than duplicate.
   - Show Jack the lines you added.
5. **Commit nothing** unless Jack asks. Just write the files.
6. **Reply with** the path and a ready-to-paste kickoff prompt in its own code block:

   ```
   Use the handoff skill to pick up from HANDOFF.md in <absolute project path>, then start on next step 1.
   ```

   Then tell him how to start fresh: in the desktop app, open a **new session** in the same folder and paste the prompt. In the terminal CLI, `/clear` and paste.

### Template

```markdown
# Handoff: <project>, <YYYY-MM-DD HH:MM>

## Goal
<one or two sentences: what we are ultimately trying to get done>

## Current state
- <what works now, with numbers: metrics, row counts, test results>
- <what is half-done and exactly where it stopped>

## Decisions made (don't relitigate)
- <decision>: <why, in one line>

## Tried and ruled out
- <approach>: <why it failed / result>

## Next steps (in order)
1. <concrete action, with file and function>
2. ...

## Open questions for Jack
- <anything blocked on his call>

## Key files
- `<path>`: <what it is, which function/lines matter>

## How to run / verify
- `<exact command>`: <what correct output looks like>

## Gotchas
- <traps the next session would otherwise hit: stale paths, slow queries, data quirks>
```

Sections with nothing in them get deleted, not filled with "none".

## Mode 2: Resume from a handoff

1. Read `HANDOFF.md`, plus the project `CLAUDE.md` if it isn't already loaded. **Do not re-explore the repo** beyond the files the handoff names.
2. Check that the handoff still matches reality: run `git status` and `git log --oneline -5`, and if anything changed since the handoff's timestamp, say so.
3. Give Jack a 3-5 line summary: goal, where things stand, the next step you're about to take, and any open questions that block it.
4. Start on next step 1 unless an open question blocks it. Treat "Decisions made" and "Tried and ruled out" as settled unless he reopens them.
