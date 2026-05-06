---
id: a835a51e-36a2
category: "[[10_Wiki/Projects/Automation]]"
confidence_score: 0.98
tags: [Automation, PowerAutomate, MSForms, Excel, LowCode, Inventory Management]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[MS Forms to Excel Inventory Automation Workflow]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide outlines the architectural process of using MS Forms as a data input interface to trigger automated record updates within an Excel master sheet via Power Automate.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Low-code automation patterns consistently use a 'Trigger -> Action -> Update' flow, ensuring that structured input (Forms) can reliably modify structured databases (Excel).
- **세부 내용:**
- **System Flow:** The workflow is initiated by 'When a new response is submitted' in MS Forms.
- **Data Mapping:** The MS Forms fields must be explicitly designed to match the header columns (Keys) of the Excel master sheet (e.g., Equipment ID).
- **Power Automate Logic:** Key steps include getting response details, identifying the unique key (Equipment ID), and executing the 'Update a row' action in Excel Online.
- **Prerequisite:** The target Excel data range *must* be formatted as an official 'Table' for the update logic to function correctly.
- **Goal:** To achieve real-time status updates (e.g., Status='In Use', Location='Site Loc') without manual spreadsheet manipulation.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Automation]]
- **Related:** [[Power Automate]], [[MS Forms]], [[Excel Online]], [[API Integration]], [[Teams Integration]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
