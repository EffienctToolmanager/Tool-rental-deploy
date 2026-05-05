---
id: 97ec79f0-8139
category: "[[10_Wiki/Skills/Code Analysis]]"
confidence_score: 0.98
tags: [Knowledge Graph, Codebase Analysis, Visualization, CLI, Software Architecture]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Graphify: Codebase Knowledge Graph Generation]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> Graphify is a core analysis skill that generates and visualizes a knowledge graph from a codebase, mapping complex inter-file relationships.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Complex dependencies in a codebase can be effectively understood and queried by modeling them as a graph structure.
- **세부 내용:**
- Analyzes a codebase to generate a knowledge graph, mapping relationships between files.
- Provides a CLI interface with commands like `graphify update [path]` for initial scanning and `graphify watch [path]` for real-time monitoring.
- Supports complex querying, including `graphify query "question"` for structural questions and `graphify path "A" "B"` for finding call paths.
- Generates key deliverables: interactive HTML visualizations, summary reports, and raw JSON graph data.
- Can assist with understanding physical code structure by generating tree views similar to folder structures.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Skills/Code Analysis]]
- **Related:** [[Knowledge Graph]], [[Codebase Architecture]], [[Graph Visualization]], [[Obsidian_Optimization]]
- **Raw Source:** [[00_Raw/Graphify_Skill_Guide_2026-05-04.md]]
