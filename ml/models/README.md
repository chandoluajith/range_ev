# Model Weights

Model checkpoints are **not committed** to this repository due to file size.

## Download

After training, model files will be saved here:

| File | Description | Size |
|------|-------------|------|
| `lightgbm_power.txt` | LightGBM gradient boosted model | ~170 KB |
| `xgboost_power.json` | XGBoost model | ~650 KB |
| `lstm_power.pt` | PyTorch deep LSTM checkpoint | ~858 KB |

## Reproduce

```bash
cd ml/training
python train_gbm.py      # trains LightGBM + XGBoost
python train_lstm.py     # trains deep LSTM (takes ~3h on CPU)
```
