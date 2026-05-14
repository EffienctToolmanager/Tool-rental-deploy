---
id: 89a00adb-233c
category: "[[Development_Tools]]"
confidence_score: 0.98

tags:
  - Knowledge Graph
  - Code Analysis
  - Visualization
  - CLI
  - Development Tools
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[Graphify: Codebase Knowledge Graph Analyzer]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> Graphify is a specialized tool that analyzes a codebase to generate an interactive knowledge graph, visually mapping complex file and functional dependencies.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Code structure analysis via graph theory provides superior understanding of inter-file dependencies compared to mere hierarchical directory listing.
- **세부 내용:**
- **Core Function:** Generates a knowledge graph from a codebase, visualizing complex relationships between files and functions.
- **CLI Commands:** Supports key functions including `graphify update [path]` (scan and update graph), `graphify watch [path]` (real-time monitoring), and `graphify query "question"` (graph-based questioning).
- **Pathfinding:** Allows for tracking function calls using `graphify path "A" "B"` to find the shortest dependency route.
- **Outputs:** Produces an interactive visualization (`graph.html`), a summary report (`GRAPH_REPORT.md`), and the raw JSON database (`graph.json`).
- **Obsidian Integration:** Supports `graphify tree` for generating a navigable, folder-structure-like view within Obsidian.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[Development_Tools]]
- **Related:** [[지식 그래프]], [[Obsidian_Optimization]], [[agent.py]], [[meta_manager.py]]
- **Raw Source:** [[Graphify_Skill_Guide_2026-05-04.md]]
