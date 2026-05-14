---
id: 13df768f-f94a
category: "[[10_Wiki/Topics/Automation]]"
confidence_score: 0.98
tags: [Power Automate, MS Forms, Excel, Workflow, Data Synchronization]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[MS Forms to Excel Automation Workflow Guide (Power Automate)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide outlines the process of automatically capturing submission data from MS Forms and updating a master inventory sheet in Excel using Power Automate.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** A successful data ingestion workflow requires a structured trigger (Form submission), defined data mapping (Header/Key), and robust write access (Excel Table).
- **세부 내용:**
- The goal is to move beyond read-only dashboard data by automating the capture of real-time rental requests.
- MS Forms items must be designed to map 1:1 with the data headers in the Excel master sheet.
- The Power Automate flow must be triggered by 'When a new response is submitted' in MS Forms.
- The core action involves 'Update a row' in Excel Online, using the Equipment ID as the key for updating status and location.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Topics/Automation]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Teams_App_Packaging_and_Branding]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
