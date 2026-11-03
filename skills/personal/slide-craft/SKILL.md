---
name: slide-craft
description: Rules for building slide presentations that actually work - one idea per slide, headline titles, picture-first slides, low cognitive load, accessible type and color, timing, and disaster-proofing. Use whenever making, outlining, rewriting, or reviewing a deck, slides, presentation, talk, pitch, seminar, lab meeting, thesis/committee talk, or conference talk, in any format (.pptx, Slides artifact, HTML, Keynote, Google Slides, PDF). Also use when the user says a deck is "too wordy", "boring", "cluttered", or asks to "make this presentable". Governs content and design; pair it with the pptx skill or a slide-deck artifact type for the file mechanics.
---

# Slide Craft

A slide deck is a visual aid for a talk, not a document. The audience is
**listening**, so every slide has to be understood in seconds while the
speaker carries the detail.

Sources: Naegle, "Ten simple rules for effective presentation slides,"
*PLoS Comput Biol* 17(12), 2021; UCSC IBSC, "Tips for Effective PowerPoint
Presentations"; Royal Geographical Society, "The Five Golden Rules of
PowerPoint Presentations." Where they disagree, the stricter rule wins.

## Workflow

1. **Story before slides.** Ask (or infer) audience, length, and the one thing
   they should remember. Write the deck as a list of headline sentences first.
   Read only the headlines in order: they should tell the whole story.
2. **Size it.** About 1 slide per minute (20-minute talk ≈ 20 slides). Talks
   over 15 minutes need a break in focus around the 15-minute mark: questions,
   a recap, a short exercise, or a speaker change.
3. **Build each slide** under the rules below: headline, one visual, minimal text.
4. **Write speaker notes.** The detail removed from the slide goes here, plus
   the transition line that leads into the next slide.
5. **Audit** with the checklist at the bottom and fix every failure before
   handing the deck over.

## Scope of each slide

- **One idea per slide.** If a slide has two points, it is two slides.
- **≤ 1 minute to present.** Longer means too much content: split or cut.
- **The title is the takeaway.** A full-sentence claim, not a topic label.
  Not "Results" but "Sinker usage drops 12 points with runners on."
  Everything on the slide must support that sentence and only that sentence.
- **Only essential points.** Anything on the slide will be looked at. If the
  speaker won't explicitly talk about it, delete it.
- **Build complex things up.** Show a big diagram or pipeline in pieces across
  several slides, ending on the full picture. Do it with duplicated slides
  that crop or cover what's not introduced yet, not with fly-in animations.
- **Distracted-viewer test.** Someone who heard nothing should still get the
  point from title + visual alone.
- **Backup slides go after the conclusion.** Extra detail for Q&A lives in an
  appendix, not crammed into the main slides.
- **Credit as you go.** Add citations and data sources the moment content goes
  on a slide, in one consistent small style (e.g., bottom-left, same size every
  time). Credit who did the work.

## Text

- **No full sentences in the body.** Reading and listening share the same
  verbal channel; the audience can't do both. Use short fragments as guide
  posts that echo what is being said.
- **Hard limits:** ≤ 5 lines per slide, ≤ 6 words per line, one thought per
  line. (UCSC says 6x6, RGS says 5x5; aim for 5x5.)
- **≤ 6 total elements per slide** (title, image, text block, label, logo...
  all count). Past ~6, cognitive load jumps sharply.
- **Almost never a text-only slide.** If a slide is just bullets, find the
  picture, chart, or diagram that makes the point, or merge it into speaker notes.
- No all caps (except maybe short titles), no underlining, no italics.
  Emphasize with **bold** or color.
- Check spelling and grammar.

## Type

- **Sans-serif fonts.** At most two font families in the whole deck.
- **Body ≥ 24 pt** (never below 20 pt). **Titles 36-44 pt** or clearly
  distinguished by color. Figure labels, axis text, and legends follow the
  same minimums: if it's on screen, it's readable.
- Set up the template (sizes, fonts, positions) before building slides, and
  fix default templates that ship with small text.
- **Six-foot test:** back away from the screen (or view the slide at ~25%
  size). If you can't read it, it's too small.

## Visuals and data

- **Build each slide around a visual.** Pictures cut explanation time and
  improve recall, and images process on a separate channel from speech.
- **One panel per slide.** Break multi-panel paper figures apart.
- **Introduce every chart out loud:** what the axes are, what a point is,
  then what it shows. Put that in the speaker notes.
- Only enough text on a chart to explain it. Label every graphic.
- **≤ 4 colors per chart.** Highlight the series that carries the point; gray
  out the rest.
- One visual style across the deck (all photos, or all flat icons, not mixed).
- No decorative clip art. An image earns its place by carrying meaning.
- Leave white space around text and graphics. Clean beats busy.

## Color and accessibility

- **High contrast**, simple low-color background. Default to dark text on a
  light background (dark backgrounds are harder for some readers).
- Keep the background consistent and subtle across slides.
- **Colorblind-safe palettes.** Never let red vs. green be the only
  distinction; pair color with position, label, or shape.
- Limit the number of colors per slide.
- Colors shift on projectors: check on the real screen if possible.

## Motion

- **No decorative animation or transitions.** Audiences dislike movement, it
  steals attention from content, burdens viewers with visual impairments,
  and breaks on other machines.
- The one allowed use: revealing points in order so the audience listens
  instead of reading ahead. Prefer doing this with duplicated slides
  (works in PDF too).

## Delivery (put in speaker notes / prep advice)

- **Never read the slides.** Slide text is a cue for the speaker.
- Practice out loud, timed, ideally in front of peers. Practice is where you
  find slides that run long, missing references, and bad order.
- Practice the **transitions**: the end of each slide should lead into the next.
- Use body language to direct attention: look/gesture at the screen when they
  should look there; step away when they should look at you.
- Face the audience; use a remote so you can move.
- For dense material, offer printed slides for note-taking.

## Disaster-proofing

- Always export a **PDF copy** alongside the native file.
- Every video gets a backup slide with stills of the key frames (start/end,
  key result).
- Fonts and animations that depend on the host machine are liabilities:
  embed fonts or stick to safe ones.
- Know which slides to skip if time gets cut.

## Audit checklist

Run on every slide; fix every "no" before delivering.

- [ ] Title is a full-sentence takeaway, not a topic label
- [ ] Exactly one idea; presentable in ≤ 1 minute
- [ ] ≤ 6 elements; ≤ 5 lines; ≤ 6 words per line; no full sentences in body
- [ ] Has a visual (or a deliberate reason not to)
- [ ] Body ≥ 24 pt, titles 36-44 pt, chart labels readable; sans-serif; ≤ 2 fonts
- [ ] No caps-lock body text, underlines, or italics
- [ ] High contrast; colorblind-safe; ≤ 4 colors on any chart
- [ ] Nothing on the slide the speaker won't mention
- [ ] Sources cited in the consistent style
- [ ] Distracted-viewer test passes (title + visual alone carry the point)
- [ ] No decorative animation; video has a stills backup

Deck level:

- [ ] Headlines alone read as the full story
- [ ] Slide count ≈ minutes; break planned if > 15 min
- [ ] Speaker notes hold the detail and the transition lines
- [ ] Backup/Q&A slides sit after the conclusion
- [ ] PDF export made
