# EvoTradeX: Ranked Top 10

## 🎨 Slide Deck
[View Slides on Canva](https://www.canva.com/design/DAGgg2SG0YQ/gWEVDtsR7krfErG3y_aS6w/edit?ui=eyJIIjp7IkEiOnRydWV9fQ)

---

## 🎥 Demo Video
Watch our detailed project walkthrough:

[![Watch on YouTube](https://img.youtube.com/vi/wn_ffmKeT-k/maxresdefault.jpg)](https://www.youtube.com/watch?v=wn_ffmKeT-k)
<sub>👆 Click the image above to watch the demo on YouTube</sub>


## 🚀 Project Overview

Investing can be overwhelming.  
**EvoTradeX** is an AI-powered portfolio management system designed to simplify investing decisions through explainable deep learning and reinforcement learning.

**Key Capabilities:**
- **Scalable** across any US stock.
- **Explainable AI**: No more black-box predictions.
- **Robust to extreme events**: Dynamic adaptation using fuzzy logic.
- **Simplified Insights**: Market trend interpretation with minimal guesswork.

## 🎯 Solution Overview

**EvoTradeX** integrates hybrid AI techniques:

- **Hybrid Deep Learning Models**:  
  - **TFT (Temporal Fusion Transformer)** for long-term trend detection.
  - **GRU (Gated Recurrent Unit)** for short-term momentum analysis.
  
- **Feature Engineering**:  
  - Statistical indicators (returns, volatility, momentum).
  - Sentiment analysis from News and Social Media.

- **Explainable Decision Layer**:  
  - Fuzzification using Gaussian Membership functions.
  - SeroFAM (Self-Reorganizing Rule Management) for human-understandable inference.

- **Reinforcement Learning for Portfolio Management**:  
  - Combines PPO, DDPG, and RARL for dynamic, volatility-adaptive asset allocation.

---

## 🧠 Architecture Highlights

- **Data Processing**: Yahoo Finance API + News API → Feature Engineering → Clustering
- **Fuzzification**: Converts hard thresholds to smooth Gaussian memberships.
- **Transformer Models**: 14 specialized models predict T+1 to T+14 future prices.
- **Rule-Based Inference**:  
  - Detects momentum shifts, volume spikes, trend reversals.
  - Continuous fuzzy rule updates.
- **RL-Based Portfolio Optimization**:
  - Maximize Sharpe, minimize volatility, drawdown.
  - Actions: Buy, Sell, Hold.

---

## 🔥 Why EvoTradeX is Different

| Feature                  | Traditional Models            | EvoTradeX                                      |
|---------------------------|-------------------------------|------------------------------------------------|
| **Market Adaptability**   | Fixed rules                   | Adaptive clustering + fuzzification           |
| **Decision Logic**        | Static ML models              | Hybrid TFT + GRU + RL                         |
| **Explainability**        | Black-box                     | Transparent fuzzy rule-based insights         |
| **Portfolio Management**  | Manual/Rule-based             | RL-powered dynamic optimization               |

---




