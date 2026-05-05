---
id: 3cc49e52-70ee
category: "[[10_Wiki/Projects/Automation_Workflow]]"
confidence_score: 0.98
tags: [PowerAutomate, MSForms, ExcelOnline, Automation, Workflow, DataSync]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[MS Forms & Power Automate Data Synchronization Workflow]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> This guide outlines the automated process of capturing equipment rental requests via MS Forms and subsequently updating the status and location in a master Excel sheet using Power Automate.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** Effective business automation requires defining the input layer (Forms) to strictly match the structure and keys of the backend data repository (Excel Table).
- **세부 내용:**
- **Objective:** To build a real-time workflow that moves beyond basic dashboard viewing by processing Forms submissions into operational data.
- **Input Design (MS Forms):** Form fields must be explicitly designed to match the data headers of the destination Excel sheet (e.g., Equipment ID as the primary search key).
- **Power Automate Flow Logic:** The trigger must be 'When a new response is submitted' (MS Forms), followed by 'Get response details' to parse the payload.
- **Update Mechanism:** The action must utilize 'Update a row' (Excel Online), critically requiring the master sheet data to be formatted as a recognized Excel 'Table'.
- **Key Prerequisites:** Access permissions for the Excel file and adherence to the 'Table' formatting structure are mandatory for the flow to succeed.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Automation_Workflow]]
- **Related:** [[20260505_Excel_Date_Header_Fix]], [[20260505_Teams_App_Packaging_and_Branding]], [[Power Automate Triggering]]
- **Raw Source:** [[00_Raw/20260505_MS_Forms_PowerAutomate_Guide.md]]
