---
name: project-intake
description: Interview Jack before anything new gets built, or grill a plan or draft he already has. Intake mode ends in a written spec, a commentable plan page, and explicit approval before any code. Grill mode pressure-tests an existing plan, design, or written answer one decision at a time. Use when Jack starts a new project, app, tool, script, or substantial feature ("I want to build", "I have an idea for", "let's make", "new project", "can we make something like this"), or when he says "grill me", "pressure-test this", "poke at this plan", or "grill my answers". Use brainstorm first if he is still choosing between directions. Use model-audit to review a finished model. Do NOT use for bug fixes, small edits, plain questions, or work with an approved spec.
---

# Project intake

A two-sentence idea leaves fifty decisions open. If Claude fills them with defaults and builds fast, Jack gets something adjacent to what he wanted. Asking costs less than rewriting, so settle the real plan before any code exists.

**Pick the mode from what exists:**

- **Intake:** something new needs to be built. Follow every step below.
- **Grill:** a plan, design, or draft already exists and needs testing. Do steps 1 and 2, then give the summary in "Finish a grill". Write a spec only if he then wants it built.
- **Still choosing a direction:** use `brainstorm` first. If a brief from `brainstorm` exists, start from it and don't re-ask what it settled.

**The rule: no implementation until the spec is written and Jack has approved it.** Reading code, querying data, and researching are encouraged. Creating source files, scaffolding, and installing dependencies wait. If he asks to skip ahead, write down the assumptions in a few lines and let him decide.

## 1. Check the facts first

Answer whatever you can yourself, so that questions go to real decisions:

- **Existing work:** look for a related repo, an earlier attempt, or code to build on. Check `CLAUDE.md` and memory for stated preferences.
- **Data, when the project uses any:** check that it can support the idea before designing around it. Confirm which columns exist, what level they're split by, how many years they cover, and whether IDs and names are clean. If the data limits the idea, say so in the first round, along with what that does to the modeling.
- **Links he sends:** read any repo, post, or example before asking about it. Say what's reusable and whether it would overcomplicate things.

Open with what you found: "You already have X. Is this building on it or replacing it?"

## 2. Interview

Use `AskUserQuestion` with concrete options. Put your recommendation first, marked "(Recommended)". Jack often answers in a couple of words, so make each option a real choice he can pick quickly.

**Walk the decision tree:**

- Ask a decision alone when its answer would change other questions. "Replacing it or extending it?" comes before anything downstream.
- Batch up to 4 questions only when they're independent of each other.
- In grill mode, stay on one branch until it's settled. Name what's still open so he knows how much is left.
- After each settled branch, restate the decision in one line so he can correct it.
- Name dependencies out loud: "Picking X rules out Y."

**Push back.** If a decision looks risky, contradictory, or more complicated than it needs to be, say so and why. Then respect his call. Explain any term he might not use day to day, and answer his questions fully before moving on, since they often reveal a problem with the plan.

**Cover what's actually uncertain,** not a fixed checklist:

- **Problem:** what's missing now, and what does solved look like?
- **Users:** just Jack, a staff, or the public?
- **Scope:** the smallest version worth having, and what waits.
- **Shape:** script, Shiny app, R package, site, iOS app, report? Where does it run?
- **Data:** what goes in, where it comes from, and where state lives.
- **Success:** what will he check to know it works?
- **Constraints:** deadlines, and systems it must fit or not touch.
- **Explainability:** will he have to defend this in an interview, a writeup, or to a coach? If so, prefer the method he can explain, and ask whether he wants code to run and walk through himself rather than files written for him.
- **How it gets built:** which model or agents write it, which reviews run, who tests it, and where it deploys. Ask this last in intake. Jack has strong and specific views here.

**Keep going until you'd stop guessing.** After each round, ask: if I started building now, what would I be guessing about? Two or three rounds is normal for a project, and one is enough for a small script. Stop when any remaining choice would be fine, then say what you're choosing.

**Respect the clock.** If there's a hard deadline, ask only what would change the result, and put the rest in assumptions.

**Grilling written answers:** for an application or questionnaire draft, test whether each claim is true, specific, and answers what was asked. Use only numbers and experience Jack has stated, and ask where one is missing. Check the rules first: if the application bans AI help, say so and don't draft for him.

## Finish a grill

Give a short summary: decisions made, risks he accepted, and anything still open. Then ask whether to fix it now, write a spec, or stop. Don't write code in this mode.

## 3. Write the spec, then publish the plan page

The markdown spec is the source of truth, and the page is the view Jack reads and comments on. Write the spec first and generate the page from it. They must never disagree.

**Location:** `<slug>-spec.md` at the project root. Inside his Second Brain vault, use `projects/<slug>.md` with the vault's frontmatter. Code itself never goes in the vault. Confirm the path in the last round.

```markdown
# <Name>

<One or two sentences: what this is and why it exists. Lead with the claim.>

## Problem
## Users
## v1 scope
<Numbered, and concrete enough to verify as done.>

## Not in v1
<Tag each item "later" or "never". Most of what gets cut from v1 is deferred, not dropped.>

## Approach
<Stack, architecture, and key decisions, with the reason for each in one line.>

## Data
<Inputs, sources, storage, formats, and what you verified in step 1.>

## Success criteria
<How we'll know v1 works. Testable.>

## Open questions and assumptions
<Anything unresolved, plus every default you chose without asking.>

## Build order
<Roughly sized. The first item should be something runnable.>

## How we build it
<Who writes the code, which reviews run, who tests, where it deploys.>
```

The assumptions section is required and is rarely empty. It's where Jack catches a wrong guess before it costs anything. Follow his writing rules: lead with the claim, no em dashes, no hype.

### Every item gets a stable ID

Prefix by section: `P` problem, `U` users, `S` v1 scope, `X` not in v1, `A` approach, `D` data, `C` success criterion, `Q` assumption or open question, `B` build step, `V` how we build, plus `ARCH` for the diagram. If a project needs a section of its own, give it a new prefix. Use the IDs in the markdown too.

**IDs are assigned once and never reused or renumbered.** When S3 is cut it stays retired, and the next item is the next unused number. Renumbering would silently repoint anything he has already referenced.

### Publish the page

Build it from `assets/plan-template.html` in this skill's folder, and publish with the Artifact tool. Load `artifact-diagramming` before drawing the diagram. The template already handles design and theming.

The diagram should show the real mechanism: what flows where, what stores state, and where the boundaries are. If the project is too small to have an architecture, cut it.

Write to one stable file path and reuse it, so the URL stays the same through the loop.

## 4. Comment loop

Hand over the URL and spec path, then ask for one of three: **approve**, **change specific blocks**, or **kill it**. Don't start on a "sounds good" that arrived faster than the page could be read.

When comments come back by ID ("A2 should be Postgres", "add S13 and S14"):

1. Edit the spec, then republish the page to the same path, every time.
2. Reply with what changed by ID, one line each. Don't re-list the plan.
3. If a comment shows a structural misunderstanding, find the other blocks it affects and fix them or ask.
4. Ask again.

## 5. After approval

Flip the page status from `draft` to `approved` and republish. Then:

- **Follow "How we build it" exactly.** If Jack named agents or review skills, use those. If he said he'll test it himself, build it and stop there rather than driving the simulator or app.
- **Offer a clean start for a big build.** If the intake ran long or the code belongs in a new folder, offer to write a handoff with the `handoff` skill so a fresh session can start there.
- **Keep the plan true.** When reality contradicts the plan mid-build, stop, update the spec and page, and say which IDs moved.

Scope ideas that come up during the build get added as new IDs rather than built silently.
