---
name: sports-mle-workflow
description: Build and maintain sports analytics models as repeatable pipelines, from the decision they inform through data contracts, baselines, evaluation, delivery, and in-season refreshes. Use when Jack is planning, building, refreshing, or productionizing a model or metric for players, pitches, lineups, games, drafts, or projections, in any sport, or turning a one-off notebook or Rmd into something a staff can rely on. Use model-audit instead for a checklist review of a finished model.
---

# Sports ML engineering workflow

Turn model work into something a coach, scout, or front office can trust next month, not just a good number today. Use only the sections the task needs. A public-data side project does not need the staff delivery steps, and a one-game report does not need a retrain plan.

Run `model-audit` before anything ships. This skill is how to build the model; that one is how to attack it.

## 1. Start from the decision

Before touching model code, fill this in and show it to Jack. It should fit in a PR description.

```text
Decision this changes:
Who makes it, and when:
Unit (pitch, PA, BIP, possession, game, player-season):
Target, and when it becomes known:
Population at prediction time:
Baseline to beat:
Metric that matters:
Costliest mistake:
Minimum sample, or shrinkage plan:
Slices to check:
How it reaches the user:
Refresh plan:
```

A model nobody will act on is a research note. Say so if that's what this is, because it changes how much of the rest applies.

Name the costliest mistake in sports terms, since it picks the metric:

| Decision | Costly mistake | Usually judge by |
| --- | --- | --- |
| Draft or signing board | Ordering players wrong near the top | Rank correlation, top-of-board hit rate |
| Projection or valuation | Biased or overconfident estimates | Error against a naive projection, interval coverage |
| Game plan or matchup | A confident call on thin data | Log loss, calibration, sample per matchup |
| Player development | Crediting noise as real change | Stability across windows, year-to-year correlation |
| Betting or pricing | Overstating edge | Calibration, performance against closing prices |

## 2. Lock the data contract

Write down, in the repo:

- **Grain and key:** one row per what, and which column proves it. Check for duplicates after every join.
- **Timing:** when each feature and label becomes known. A season total includes games that hadn't happened yet on any date inside that season.
- **Identity:** how player IDs map across sources. Check that names and IDs map one to one, and handle transfers, promotions, and players who appear at multiple levels.
- **Coverage:** percent non-null by season and by level. A feature that only exists for recent years or certain parks limits the whole model.
- **Measurement:** units, tracking system, and version. Treat a change in hardware, vendor, ball, or rules as a possible break in the data until checked.
- **Snapshot:** the exact query and date, so the training set can be rebuilt.

Save the training query in the repo. In Postgres, always quote identifiers:

```sql
SELECT "PitchUID", "PitcherId", "Date", "PitchCall"
FROM "pitches"
WHERE "Date" < '2026-01-01';
```

Sports data has selection built in, so name it up front:

- **Survivorship:** outcomes at the next level exist only for players who got there.
- **Playing time:** good players get more reps, and injured or struggling ones get fewer. Missing data is rarely random.
- **Opponent and context:** level, conference, park, weather, and opposing talent all shape raw numbers.
- **Selection into the event:** a swing, a shot, or a defensive matchup is a choice. A model of what happens after one only describes that subset.

## 3. Split like the model will be used

- Hold out the most recent complete seasons and don't touch them until every modeling decision is made.
- Cross-validate grouped by player or team, with `rsample::group_vfold_cv()` or the equivalent, so the same player never informs both sides of a fold.
- Report returning players and new players separately when a holdout has both. They answer different questions.
- Keep the fit inside the fold: scaling, imputation, target encoding, and feature selection all count as fitting.
- Compute rolling and lagged features with windows that end before the event.

Say plainly when there isn't enough data to support a split. Small college samples often can't back up a complex model.

## 4. Earn complexity

Build in this order, and move on only when the current step fails for a reason the next step can fix:

1. A simple benchmark: league average, last season's value, or Marcel-style weighted history.
2. Shrinkage toward a sensible prior, usually by position, level, or role.
3. A regularized or hierarchical model.
4. Gradient boosting or anything else harder to explain.

Every feature family needs a reason it should separate outcomes and a note on how it could leak. Pick features by group through the grouped CV, and keep or drop each group whole.

## 5. Decide what passes before training finishes

Write the gates down first, so a result can't talk its way past them:

```r
gates <- tibble::tribble(
  ~metric,       ~direction, ~threshold,
  "spearman",    "min",      0.60,
  "calibration", "max",      0.05
)

failed <- gates |>
  dplyr::left_join(metrics, by = "metric") |>
  dplyr::filter(
    is.na(value) |
      (direction == "min" & value < threshold) |
      (direction == "max" & value > threshold)
  )

if (nrow(failed) > 0) stop("Failed gates: ", toString(failed$metric))
```

Those thresholds are placeholders. Set real ones from the baseline and the decision, then:

- Compare against the baseline and the current model, not against zero.
- Show uncertainty by player or season so that a small win isn't overread.
- Check slices that matter: level, conference, handedness, pitch type, count, role, position, age, season, and tracking system.
- Sanity check against a public metric where one exists, and explain the gap instead of tuning to it.

## 6. Learn from the misses

The loop is miss, cluster, hypothesis, experiment, evidence. After each run:

1. Pull the biggest misses by name. Someone who knows the sport should be able to explain them or find them surprising.
2. Group them by shared traits, such as a level, a pitch type, an age band, or a season.
3. Separate model errors from data bugs, thin samples, and real changes in the player, such as an injury or a new pitch.
4. Pick one move: better data, better features, more shrinkage, or a narrower claim about what the model can do.
5. Turn each bug into a test, then write the next step as an experiment that could fail.

Keep a short log beside the code:

```text
Change:
Why:
Metric and slice movement:
Biggest misses:
Decision and tradeoff:
Test added:
Next experiment:
```

## 7. Make it rebuildable

- One command rebuilds the output from raw data, with no hidden notebook or session state.
- Record seeds, package versions (`renv` or a lockfile), the data snapshot, and the code commit with each model artifact.
- Keep one set of transforms for training and scoring. Test them with a known-answer check on a few real rows.
- Keep constants in one place. When a base model changes, refit everything built on its outputs, and re-pin any numbers in tests and reports.
- Generate the numbers in reports from the run itself. Don't type them in by hand.

## 8. Deliver it in the user's language

Most sports models reach people as a report, card, app, or table. The user is often a coach with a few minutes before a game.

- Lead with the decision and put methodology last.
- Translate to units people use: runs, wins, dollars, or plain percentiles. State what a percentile is relative to.
- Show sample size next to every number, and visibly flag small samples.
- Stamp each output with the model version and data-through date.
- Decide what happens when data is missing or a player is new. A blank with a reason beats a confident guess.
- Check that explanations make sense in the sport before showing them. If a breakdown says something absurd, fix the encoding.

Team data, internal grades, and medical information stay out of public repos, logs, and examples.

## 9. Keep it healthy over the season

- **Before each refresh:** check row counts, new or missing IDs, null rates, and feature distributions against last refresh.
- **During the season:** early-season samples are thin, so lean on priors and say so. Track predictions against outcomes as they arrive.
- **When rules or equipment change:** check drift first. Recalibrate on recent out-of-fold predictions if ranking holds but levels are off. Refit if ranking breaks.
- **Long-delay labels:** prospect outcomes take years, so use earlier checkpoints as stand-ins, and label them as stand-ins.
- **Feedback loops:** once staff act on a model, behavior changes. An attack plan that works can change how hitters are pitched and what the data shows next.
- **Rollback:** keep the last good artifact so a bad refresh can be reverted without retraining.

## Output

Return concrete artifacts: the decision sheet, data contract, gates, pipeline steps, test plan, or refresh plan. Call out unknowns that block trust rather than filling them with assumptions. Never invent a metric or result, and mark anything not verified by running code as `(unverified)`.

## Attribution

Adapted from the `mle-workflow` skill in [ECC](https://github.com/affaan-m/ECC), used under the MIT license. See [LICENSE](LICENSE).
