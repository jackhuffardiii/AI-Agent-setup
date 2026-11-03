# Worked examples (from past audits)

## XGBoost whiff model misuse (200k pitches, correct mean 0.240)

| Input setup | Mean prediction | Deviation |
|---|---|---|
| Correct: swings only, 23 cols in order | 0.240 | baseline |
| All pitches, not just swings | 0.344 | +43% |
| PlateLocHeight in inches, not feet | 0.364 | +52% |
| Strikes as factor level codes | 0.218 | −9% |
| Columns shuffled | 0.690 | +187% |

```r
m <- xgb.load("whiff_exp.ubj")
X <- as.matrix(df[, m$feature_names])
pred <- predict(m, X)
```

## Conditional label check (whiff | swing)

```r
whiff_train <- train_full |> filter(isSwing == 1, !is.na(isWhiff))
```
Cross-tab of `PitchCall` by (isSwing, isWhiff): every StrikeSwinging = 1/1, every FoulBall and InPlay = 1/0, no 0/x rows.

## MiLB projection models
- Leakage: weight 206 lb (reached MLB) vs 196 lb (did not), because weight was updated after signing.
- Era drift: swing rate gave +0.34 to P(MLB) in 2026 projections; 2026 swing rates sit above the 2005–17 training average (pitch clock, ABS).
- Model selection: LightGBM beat ridge on RMSE (4.134 vs 4.142) but lost on Spearman (0.131 vs 0.163). Ridge was the right pick.
- Feature groups: six groups tested via GroupKFold(5) by player on 12,306 rows; kept speed, position, pace, body.
- Domain features: replacing raw position dummies with positional run values fixed "+3 wins for DH"; Spearman for reached players 0.395 vs 0.380 before.
- Recalibration on the last 3 training seasons' OOF predictions recovered 1–3 points per decile.

## Fine-grain metric check
Per-pitch-type EV90s (100.7, 99.6, 97.0) bracket the overall 99.9. If they don't bracket, the calculation is wrong.
