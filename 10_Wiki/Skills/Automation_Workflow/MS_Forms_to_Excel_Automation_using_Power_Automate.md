---
id: 0f8b3dc2-4da1
category: "[[10_Wiki/Skills/Automation_Workflow]]"
confidence_score: 0.98
tags: [Power Automate, MS Forms, Excel Online, Automation, Microsoft 365]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[MS Forms to Excel Automation using Power Automate]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide outlines a workflow automating equipment rental data capture by triggering Power Automate actions upon submission of an MS Form, which then updates a master tracking sheet in Excel.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Routine business process automation follows a pattern: Capture (Form) -> Trigger (Workflow) -> Transform/Store (Excel Update).
- **세부 내용:**
- The goal is to move beyond Teams dashboards by using MS Forms for real-time equipment rental applications.
- MS Forms fields must map 1:1 with the data headers in the master Excel sheet.
- The Power Automate logic starts with the 'When a new response is submitted' trigger.
- Subsequent actions involve parsing the response details and using 'Update a row' in Excel Online.
- Crucially, the master data must be formatted as an Excel 'Table' and the primary key (Equipment ID) must be used for targeted row updates.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Skills/Automation_Workflow]]
- **Related:** [[Excel Online]], [[Power Automate Triggers]], [[Data Workflow Design]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
