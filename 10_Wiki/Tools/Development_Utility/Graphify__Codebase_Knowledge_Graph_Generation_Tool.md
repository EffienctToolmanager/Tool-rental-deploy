---
id: d8c3b293-14c2
category: "[[10_Wiki/Tools/Development_Utility]]"
confidence_score: 0.98
tags: [Knowledge Graph, Code Analysis, Visualization, CLI, Architecture]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[Graphify: Codebase Knowledge Graph Generation Tool]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> Graphify is a specialized tool that analyzes a codebase to generate and visualize a knowledge graph, detailing complex inter-file relationships and architectural connections.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Understanding complex software architecture requires visualizing the relationships (calls, dependencies) between individual components, moving beyond simple file lists.
- **세부 내용:**
- Graphify creates a knowledge graph by analyzing a codebase, registering as a core analysis skill of Anti-Gravity.
- Key CLI commands include `update [path]` for initial scanning, `watch [path]` for live monitoring, and `query "question"` for structural queries.
- Specific commands allow finding the shortest path (call chain) between two nodes (`graphify path "A" "B"`).
- The tool integrates with the Anti-Gravity assistant via `graphify antigravity install` for custom workflows.
- Outputs include an interactive visualization (`graph.html`), a summary report (`GRAPH_REPORT.md`), and the raw data (`graph.json`).

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Tools/Development_Utility]]
- **Related:** [[지식 그래프]], [[Obsidian_Optimization]], [[agent.py]], [[meta_manager.py]]
- **Raw Source:** [[00_Raw/Graphify_Skill_Guide_2026-05-04.md]]
