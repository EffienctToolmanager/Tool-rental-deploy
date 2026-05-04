# P-Reinforce System Policy

## 🧠 Initial RL Weights
- **w1 (Categorization Accuracy):** 0.33
- **w2 (Graph Connectivity):** 0.33
- **w3 (User Satisfaction):** 0.34

## 📌 지식 아카이빙 정책 (Autonomous Archiving Policy)
- **자율성**: 어시스턴트는 주요 기술적 해결, 의사결정, 정책 수립 시 즉시 `00_Raw`에 기록을 남긴다.
- **연동성**: 모든 기록은 `agent.py`가 감지할 수 있도록 마크다운 형식으로 작성한다.
- **영속성**: 어시스턴트는 워크스페이스가 변경되어도 이 규칙을 가장 먼저 상기하고 유지한다.

