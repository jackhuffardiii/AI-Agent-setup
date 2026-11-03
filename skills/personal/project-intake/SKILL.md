---
name: project-intake
description: Interview the user thoroughly before building anything new, then write a spec file, publish it as a visual plan page whose every block is individually commentable, and get explicit approval before any code is written. Use this whenever the user starts a new project, app, tool, script, or repo, or floats a new idea they want built ("I want to build...", "I have an idea for...", "let's make a...", "new project", "thinking about building", "wouldn't it be cool if"), and whenever a request would create a new codebase or a substantial new feature whose shape isn't already pinned down. Use it even when the idea sounds simple and even when the user seems ready to start coding immediately, because a wrong assumption locked in at line one is the expensive kind. Do NOT use for bug fixes, small edits to existing code, questions, or work whose spec is already written and approved.
---

# Project intake

The failure mode this exists to prevent: the user describes an idea in two sentences, Claude fills the other fifty decisions with its own defaults, builds fast, and delivers something adjacent to what they wanted. Rewriting is more expensive than asking. So before any code exists, extract the real plan and get it approved in writing.

The user asked for this explicitly. They want to be asked. Do not shortcut it to seem efficient — silence here reads as guessing, not speed.

## The rule

**Write no implementation code until the spec file is written and the user has approved it.** Reading the codebase, checking what exists, and researching APIs is fine and encouraged during the interview. Creating source files, scaffolding a repo, or installing dependencies is not.

## 1. Ground yourself first

Before the first question, spend a moment on cheap context so you don't ask things you could have looked up:

- Is there an existing repo, related project, or prior attempt at this? Glob/grep for it.
- Does the user's CLAUDE.md or memory already state a preference that answers a question you were about to ask (stack, conventions, where files go)?

Every question you can answer yourself is one the user doesn't have to. Bring what you found into the first round: "I see you already have X — is this building on it or replacing it?" is a better opening than "what's your tech stack?"

## 2. Interview in rounds

Use the AskUserQuestion tool, **3-5 questions per round**, with concrete options rather than open prompts. A question with options is faster to answer and surfaces choices the user hadn't considered. Mark your recommendation "(Recommended)" and put it first — you have context, use it. Free-text answers are always available to them, so options don't constrain.

Round one covers the load-bearing decisions. Adapt to what's actually uncertain — do not walk a fixed checklist:

- **Problem** — what's broken or missing now, and what does "solved" look like concretely?
- **Users** — just them, a team, the public? This drives almost everything downstream.
- **Scope** — the smallest version worth having (v1), versus what's explicitly out for now.
- **Shape** — CLI, script, web app, R package, Shiny app, notebook, service? Where does it run?
- **Data** — what goes in, where does it come from, where does state live?
- **Success** — how will they know it works? What do they check?
- **Constraints** — deadline, existing systems it must fit, things it must not touch.

**Then keep going.** After each round, ask yourself: if I started building right now, what would I be guessing about? Every real answer to that is the next round. Two or three rounds is normal. Stop when the only open questions are ones where any reasonable choice would be fine — and say which ones those are and what you're choosing.

Scale the depth honestly. A one-off 30-line script does not need three rounds; a new app does. Under-asking on something large is the failure this skill exists to prevent, so when unsure, ask the extra round.

**Do not batch a question you should ask alone.** If an answer would invalidate half your other questions (e.g. "is this replacing the existing system or extending it?"), ask that first, by itself, then build the round around the answer.

## 3. Write the spec, then publish it as a visual plan

Two deliverables, one source of truth. The **markdown spec** is the source of truth: it lives in the repo, it's greppable, it survives offline, and it's what implementation actually reads. The **published artifact** is the view: it's what the user reads and comments on. Write the spec first, then generate the page from it. They must never disagree.

Default spec location: the project root as `<slug>-spec.md`; inside Jack's Second Brain vault, `projects/<slug>.md` with the vault's frontmatter conventions instead. Confirm the path in the last question round rather than assuming.

Structure:

```markdown
# <Name>

<One or two sentences: what this is and why it exists. Lead with the claim.>

## Problem
## Users
## v1 scope
<Numbered list. Each item concrete enough to verify as done.>

## Explicitly out of scope
<The things you asked about and they said "not now." This section prevents scope creep more than any other.>

## Approach
<Stack, architecture, key decisions, and the reasoning for each. One line each.>

## Data
<Inputs, sources, storage, formats.>

## Success criteria
<How we'll know v1 works. Testable.>

## Open questions and assumptions
<Anything unresolved, plus every default you chose without asking. This is where the user catches you.>

## Build order
<The sequence of work, roughly sized. First item should be something runnable.>
```

The "Open questions and assumptions" section is not optional and is rarely empty. Listing your assumptions is how the user catches a wrong one before it costs anything.

Write it in the user's voice conventions if they have them (Jack's: lead with the claim, no em dashes, no hype, terse and factual).

### Every claim gets a stable ID

Prefix by section so an ID says what it refers to on sight: `P` problem, `U` users, `S` v1 scope, `X` out of scope, `A` approach decision, `D` data, `C` success criterion, `Q` assumption or open question, `B` build step, plus the bare word `ARCH` for the architecture diagram.

Put these IDs in the markdown spec too, not just the page. Six months later "why did we do A3 that way" should be answerable with grep.

**IDs are assigned once and never reused or renumbered.** When S3 gets cut, S3 stays retired and the next new item is S9 — do not close the gap. Renumbering silently repoints every reference the user has already made, so a comment they typed a minute ago now lands on different text. Gaps are free; collisions are not.

### Publish the page

Build it from `assets/plan-template.html` in this skill directory. Copy it to the workspace, replace the placeholder content, publish with the Artifact tool. The template already carries the page design and light/dark theming, so don't re-derive one — load `artifact-diagramming` before drawing the architecture diagram, and only load `artifact-design` if you're departing from the template substantially.

The architecture diagram is the part worth real thought. It should show the actual mechanism — what flows where, what stores state, where the boundaries are — not a row of pretty boxes restating the section headers. If the project is too small to have an architecture, cut the diagram rather than padding it; a one-file script doesn't need a flowchart.

Write the artifact to a **stable file path** and reuse it on every republish, so the URL never changes across the comment loop. The user will have it open in a tab.

## 4. The comment loop

Hand over the URL and the spec path, and ask plainly for one of three: **approve**, **change specific blocks**, or **kill it**. Ask whether they've actually read it — do not start building on a "sounds good" that arrived faster than the page could be read.

When comments come back keyed to IDs ("A2 should be Postgres", "S4 is out of scope, and X2 is wrong"):

1. Edit the markdown spec, then regenerate and republish the page to the same path. Both, every time. A page that has drifted from the spec is worse than no page, because it's still convincing.
2. Reply with what changed, by ID, in one line each. Not a re-listing of the whole plan — they can see the plan, they want the diff.
3. When a comment reveals you misunderstood something structural, don't just patch the block they named. Say which other blocks the correction implicates and fix those too, or ask. One wrong assumption usually shows up in several places.
4. Ask again.

Loop until approved. Then flip the page's status from `draft` to `approved` (the template has a class for it) and republish, so the tab they left open says so.

Only after explicit approval does implementation start. Work through the build order. When reality contradicts the plan mid-build — it will — stop, update the spec and the page, and say which IDs moved. A stale plan is worse than none, and the whole point of the IDs is that keeping it current is cheap.
