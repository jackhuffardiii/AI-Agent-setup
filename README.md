# claude-desktop-mods

The Claude Code setup I use for baseball analytics, modeling, and general project work: one custom mod and the skills I rely on.

```
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
| [project-intake](skills/personal/project-intake) | Interviews me and gets a written spec approved before any code on a new project |
| [slide-craft](skills/personal/slide-craft) | Rules for decks: one idea per slide, headline titles, low cognitive load |
| [sports-mle-workflow](skills/personal/sports-mle-workflow) | Builds sports models as repeatable pipelines, from the decision through in-season refreshes. Adapted from [ECC](https://github.com/affaan-m/ECC) (MIT) |

These are written for my own workflow, so they refer to me by name. Change those references if you adapt them.

### Community

| Skills | What they do | Source | License |
| --- | --- | --- | --- |
| [superpowers](skills/community/superpowers) (15) | Process skills: brainstorming, plans, debugging, TDD, code review | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| [ponytail](skills/community/ponytail) (6) | Pushes toward the simplest code that works, plus over-engineering audits | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT |
| [taste-skill](skills/community/taste-skill) (13) | Frontend art direction | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT |
| [fable-advisor](skills/community/fable-advisor) (1) | Routes work between model tiers to control cost | [DannyMac180/fable-advisor](https://github.com/DannyMac180/fable-advisor) | MIT |
| [frontend-design](skills/community/frontend-design) (1) | Distinctive UI design guidance | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache 2.0 |
| [find-skills](skills/community/find-skills) (1) | Finds and installs skills | [vercel-labs/skills](https://github.com/vercel-labs/skills) | MIT |
| [grill-me](skills/community/grill-me) (1) | Interviews me about a plan until it holds up | [MCPmarket](https://mcpmarket.com) | MIT |

These are snapshots, so the source repos are the place to get updates.

### Used but not copied here

- Anthropic's built-in `docx`, `pdf`, `pptx`, and `xlsx` skills are proprietary and come with Claude.
- Skills specific to one project stay in that project.

## The rest of the setup

- [RTK](https://github.com/rtk-ai/rtk) condenses command output through a Claude Code hook.
- Ponytail's hooks keep its mode active across sessions and subagents.
- The status line combines [Get Shit Done](https://github.com/glittercowboy/get-shit-done) with a small context-usage script of my own.
