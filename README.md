# claude-desktop-mods

The Claude Code setup I use for baseball analytics, modeling, and general project work: an end-to-end workflow, one custom mod, and the skills I rely on.

Start with [the analytics project workflow](WORKFLOW.md), which shows how the pieces fit together.

```
WORKFLOW.md            How I run an analytics project, start to finish
.claude-plugin/        Plugin marketplace manifest
mods/auto-handoff/     Hands long sessions off to a fresh one
skills/personal/       Skills I wrote
skills/community/      Open-source skills I use, with their licenses
```

## Auto-handoff

Long sessions get more expensive every turn, because each turn re-reads the whole history. When a session reaches 300k context tokens, this mod shows a toast, lets the current turn finish, and then has Claude run the `handoff` skill. That writes `HANDOFF.md`, records what went wrong in project memory, and gives you a kickoff prompt for a fresh session.

It fires once per session and re-arms if `/clear` or `/compact` drops the context below 150k. Both values are constants at the top of [`hooks/register.ts`](mods/auto-handoff/hooks/register.ts).

Install it from inside Claude Code:

```
/plugin marketplace add jackhuffardiii/claude-desktop-mods
/plugin install auto-handoff@claude-desktop-mods
```

The mod depends on the `handoff` skill, so copy that too:

```bash
cp -R skills/personal/handoff ~/.claude/skills/
```

## Skills

To use any skill, copy its folder into `~/.claude/skills/`.

### Personal

| Skill | What it does |
| --- | --- |
| [handoff](skills/personal/handoff) | Writes a handoff for a fresh session, or resumes from one |
| [model-audit](skills/personal/model-audit) | Audits a model against a fixed checklist: leakage, splits, CV, calibration, drift, sample size |
| [brainstorm](skills/personal/brainstorm) | Explores directions, recommends one, and hands a brief to `project-intake` |
| [project-intake](skills/personal/project-intake) | Interviews me and gets a written spec approved before any code, or grills a plan or draft I already have |
| [slide-craft](skills/personal/slide-craft) | Rules for decks: one idea per slide, headline titles, low cognitive load |
| [sports-mle-workflow](skills/personal/sports-mle-workflow) | Builds sports models as repeatable pipelines, from the decision through in-season refreshes. Adapted from [ECC](https://github.com/affaan-m/ECC) (MIT) |

These are written for my own workflow, so they refer to me by name. Change those references if you adapt them.

### Community

| Skills | What they do | Source | License |
| --- | --- | --- | --- |
| [ponytail](skills/community/ponytail) (3) | Pushes toward the simplest code that works, plus over-engineering audits | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT |
| [fable-advisor](skills/community/fable-advisor) (1) | Routes work between model tiers to control cost | [DannyMac180/fable-advisor](https://github.com/DannyMac180/fable-advisor) | MIT |

These are snapshots of only the skills I use, so the source repos have the full sets and any updates.

### Used but not copied here

- Anthropic's built-in `docx`, `pdf`, `pptx`, and `xlsx` skills are proprietary and come with Claude.
- Skills specific to one project stay in that project.

## The rest of the setup

- [RTK](https://github.com/rtk-ai/rtk) condenses command output through a Claude Code hook.
- Ponytail's hooks keep its mode active across sessions and subagents.
- The status line combines [Get Shit Done](https://github.com/glittercowboy/get-shit-done) with a small context-usage script of my own.
