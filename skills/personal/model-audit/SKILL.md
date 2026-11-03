---
name: model-audit
description: Audit a model, metric, or stats pipeline against a fixed checklist (leakage, splits, CV, calibration, drift, sample size, benchmarks, scoring bugs) and return a ranked findings table. Use when Jack says "audit this", "poke holes", "be extremely vigilant", "is this ready for production", "review the methodology", "audit the PR", or when a holdout result disappoints, predictions look off, a breakdown contradicts baseball logic, or a model is about to ship. Also use while building any model, as the checklist of things not to get wrong.
---

# Model audit

Run the checklist below in order. Don't do an open-ended hunt: check each item, record a verdict, move on. Read only the files that train, split, score, or report; grep the rest.

## Scope first (2 minutes)
- What is the target, the unit (pitch, PA, player-season), and the serve-time population?
- Where are the training, validation, and holdout splits defined? Has the holdout been looked at, and how many times?
- What metric is the model chosen by, and what metric does Jack actually care about?

## Checklist

**1. Target leakage**
- Any feature known only after the label? Watch for values that get updated: weight, roster status, accolades, season totals that include the predicted window. Heights and birthdates are stable; those are fine.
- Test: compare each feature's distribution between outcome classes. A gap above ~10% of the positive-class mean on a feature that *could* change during the window means look-ahead until proven otherwise. (Example: reached-MLB players averaged 206 lb vs 196 lb, because weight was recorded after signing.)
- Rolling or lagged features: confirm the window ends before the event, not on it.

**2. Splits and the holdout**
- Split by time, and grouped by entity (pitcher, hitter, player). The same player must not sit in train and test.
- The holdout is touched once, after every modeling decision. If it informed feature, model, or tuning choices, the reported number is biased; say so.
- Holdout disappointing? Diagnose with training-era CV/OOF first. Strong in CV, weak on holdout usually means those years are odd, not that the model is broken. Pick fixes from CV evidence only.

**3. Cross-validation design**
- GroupKFold (or `group_vfold_cv`) by entity, never plain k-fold on repeated players.
- Feature selection by *groups* (contact, batted ball, speed, body...) through that CV, kept or dropped whole. No piecemeal tuning against one fold.
- Null baseline for any keep/drop rule: run it on pure-noise features. If noise passes often, the rule can't tell a real feature from luck.
- Every feature has std > 0 within the fit sample (and within each fold). A constant column breaks scaling and clustering.
- Model chosen by the evaluation metric that matters (Spearman for rankings, logloss/Brier for probabilities), not the training loss. A small RMSE win can hide a large ranking loss.

**4. Conditional models and scoring**
- P(A|B) models (whiff | swing, damage | contact) must be trained on B = true only, with labels defined after the filter. Check the cross-tab of `PitchCall` by label.
- Scored on the same subset at serve time. Scoring all pitches with a swings-only model inflates the mean.
- XGBoost: R `predict()` matches columns by position. Build the matrix from `model$feature_names`, pass a numeric matrix (not a data frame), check units (feet vs inches) and factor encoding, and run a known-answer check on 3 rows. See `references/worked-examples.md` for what each mistake does to the mean.
- Model file checksum matches what training produced.

**5. Calibration and drift**
- Calibration by decile, and by era and segment (level, conference, handedness).
- Training era vs prediction era: check feature means shift (pitch clock 2023, ABS, new ball, new TrackMan hardware). A big contribution from a drifted feature is suspect.
- If predictions are biased in a newer era: recalibrate (Platt or isotonic) on OOF predictions from the most recent seasons, chosen by CV on those rows, never on the holdout. Recalibration fixes calibration, not ranking.

**6. Sample size**
- Every rate stat needs a floor (e.g. 50 PA, 100 pitches, 30 BIP) or shrinkage toward a prior. Name the stabilization point used.
- Flag windows below the floor; exclude, downweight, or add context (injury, demotion). Say plainly when a sample is too small to conclude anything.
- Before spending a one-shot test (holdout seasons, a live trial): plant effects at 0, 0.5, 1, 2, 3× the expected size in synthetic or pre-test-era data and run the full pipeline. Effect 0 gives the false-positive rate (~5%); the rest give power and the minimum detectable effect.
- Feature coverage by year: % non-null per season. A feature missing in recent years breaks the snapshot you actually predict on.

**7. Sanity against the outside world**
- Compare with a public benchmark on overlapping players: Stuff+, FIP/xFIP, ERA, wOBA, public WAR, prospect rankings. Report the correlation honestly; don't tune to pass. The gap tells you what the model leaves out.
- New fine-grain metrics (per pitch type, per count) should bracket or match the overall value.
- Decomposed models (value split into components): components must sum to the total, player by player. Check the residual.
- Refit a base model → refit everything trained on its outputs.
- Breakdowns (SHAP, coefficients) must make baseball sense. If "DH adds +3 wins," the features need domain encoding (e.g. positional adjustment) rather than raw dummies. Ridge with collinear inputs: sum coefficients within a family before showing them.
- Right-skewed targets (WAR, $): a median well below the mean is expected, not a bug. Label it as the median, check 10–90 interval coverage on the holdout (~80%).

**8. Reproducibility**
- Seeds set; package versions recorded; the training query is in the repo, with quoted identifiers.
- The numbers in the report or PR description come from a run of the current code.

## Output

Lead with a one-line verdict (ship / ship with fixes / don't ship). Then one table, most severe first:

| # | Severity | Check | Finding (file:line) | Why it matters | Fix |
|---|---|---|---|---|---|

Severity: **Blocker** (results are wrong or leaked), **Major** (numbers biased or unreliable), **Minor** (hygiene, reporting). Only list real findings; list passed checks in one line underneath ("Passed: 2, 3, 6"). Mark anything not verified by running code as `(unverified)`.

Don't apply fixes unless Jack asks. Don't run the holdout to check a fix.
