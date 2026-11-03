---
name: brainstorm
description: Explore directions with Jack when he knows the problem but not the answer, then recommend one and hand a short brief to project-intake if it needs building. Use when he says "brainstorm", "what are some ways", "suggest some ways", "give me options", "should we look into", "could we do something like this", "what would that look like", or "let's go back to the roots", or brings a coach's idea, an article, or a half-formed modeling or product idea. Do NOT use when the task is already clear, when he wants a specific fix or result, or when he has already picked a direction (use project-intake for that).
---

# Brainstorm

Get Jack from "I have a problem or a half idea" to "this is the direction, and here's why." Stay light. This is for finding the right thing to do, while `project-intake` pins down how to build it.

No project code or files during a brainstorm. Read code, query data, and research as much as helps. A quick throwaway plot or query is fine when it would settle a question, as long as it's labeled as a throwaway.

## 1. Go back to the roots

Before offering ideas, state these in a few lines and let Jack correct them:

- **The real question:** what are we trying to decide or improve?
- **Who cares:** the coach, front office, interviewer, user, or just Jack, and what they want from this.
- **What we already have:** related code, models, data, and past attempts. Look these up rather than asking.
- **What limits us:** data, deadline, or a need to explain the result simply.

Ask only if one of these is truly unclear and the answer would change the options. Ask one question at a time, in plain language. If he uses an idea or formula of his own, take it seriously and build from it instead of replacing it.

## 2. Check what's possible

Check the facts behind each idea before presenting it. Confirm that the columns exist, the sample is big enough, and the market or user problem is real. An option that fails on contact with the data wastes his time. If a quick look could kill or confirm an idea, do it now and report the result.

## 3. Offer real options

Think wide on your own first, then drop weak ideas. Show 2 to 4 that are actually different from each other, not variations on one approach.

Label them A, B, C so he can answer quickly. For each one, give:

- **What it is,** in a sentence or two.
- **Why it could work,** tied to his goal.
- **What it costs or risks,** including effort and how hard it is to explain.
- **What it needs:** the data or work required, and whether you've verified it.

Then lead with your pick: "I'd go with B, because...". Say what would change your mind. Define any term he may not know.

Jack often combines options, picks more than one, or asks to run two in parallel. Treat that as a normal answer and work out what combining them requires.

## 4. Test the favorite

Once a direction leads, try to break it before committing:

- What's the strongest reason this is wrong?
- What's the simple baseline it has to beat?
- What's the cheapest test that would tell us early? For analytics, this is often a small plot or query he can run himself.
- If it works, what actually changes for the person who cares?

If the idea doesn't survive, say so plainly. "Don't do this" is a useful outcome.

## 5. Land it

Say the size of what's left, and let him overrule it:

| What's left | Next step |
| --- | --- |
| Nothing worth doing | Say why, and stop |
| A quick test or analysis | Do it, or give him the code to run himself |
| A small change | Say what you'd change, and build it once he agrees |
| A new project or big feature | Write the brief below and hand it to `project-intake` |

### The brief

Write this in the chat, in a few lines. It's the starting point for `project-intake`, so that it doesn't re-ask anything settled here.

```markdown
## Brainstorm brief: <topic>
**Question:** <what we're deciding>
**For:** <who cares, and what they need>
**Direction:** <the option chosen, including any combination>
**Why:** <the reason, in one or two lines>
**Ruled out:** <each option, with the reason>
**Verified:** <facts checked: data, coverage, feasibility>
**Still open:** <what project-intake needs to settle>
```

In `project-intake`, the direction becomes the first `A` decision, ruled-out options go in its reasoning, and verified facts go in `D`. Anything he said to save for later becomes an `X` item tagged "later".

Save the brief to a file only if he asks or the work will continue in another session.
