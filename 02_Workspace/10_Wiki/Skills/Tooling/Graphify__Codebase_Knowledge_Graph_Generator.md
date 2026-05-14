---
id: d91819a6-f1fe
category: "[[10_Wiki/Skills/Tooling]]"
confidence_score: 0.98
tags: [Code Analysis, Knowledge Graph, Visualization, CLI, Software Architecture]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Graphify: Codebase Knowledge Graph Generator]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> Graphify is a core analysis tool that processes a codebase to generate a visual, interactive knowledge graph, mapping complex interdependencies between files and functions.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** True understanding of a codebase requires mapping explicit structural dependencies (file-to-file, function-to-function) into a queryable, visualized graph.
- **세부 내용:**
- Purpose: Generates a Knowledge Graph (KG) from a codebase, essential for visualizing complex interconnections.
- CLI Command: `graphify update [경로]` performs the initial scan and graph generation.
- Real-time Feature: `graphify watch [경로]` provides automated, continuous graph updates upon code changes.
- Querying: `graphify query "질문"` allows users to ask structural questions based on the graph data.
- Visualization Outputs: Generates several artifacts, including an interactive `graph.html`, a summary report (`GRAPH_REPORT.md`), and raw data (`graph.json`).
- Utility: Can integrate with tools like Obsidian using a `graphify tree` command to visualize the physical folder structure alongside the logical graph.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Skills/Tooling]]
- **Related:** [[지식 그래프]], [[Obsidian_Optimization]], [[agent.py]], [[meta_manager.py]]
- **Raw Source:** [[00_Raw/Graphify_Skill_Guide_2026-05-04.md]]
