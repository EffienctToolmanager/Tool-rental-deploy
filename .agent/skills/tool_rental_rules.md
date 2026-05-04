---
title: Operation_public 대여 시스템 규칙
description: 비품 대여 앱 개발 및 데이터 관리 전용 로직 스킬
scope: workspace
trigger: "When modifying Tool Rental App logic or database"
---

# 🛰️ Operation_public 대여 시스템 규정

이 스킬은 비품 대여 앱(Tool Rental App)의 데이터베이스 로직이나 코드를 수정할 때 호출됩니다.

## 1. 데이터 아키텍처 (Data Architecture)
- 모든 데이터베이스 연동은 **MS 365 SharePoint List**를 기준으로 작성할 것.
- JSON 연동 시 SharePoint REST API 또는 Power Automate 트리거 형식을 준수할 것.

## 2. 명명 규칙 (Naming Conventions)
코드 및 데이터 필드 내 변수명은 아래 표준을 반드시 따름:
- **대여**: `Checkout`
- **반납**: `Return`
- **비품**: `Tool`

## 3. 리포팅 및 백업
- 모든 작업 결과 로그 및 데이터 요약은 무조건 **Markdown 표(Table) 형식**으로 출력할 것.
- 이는 옵시디언(Obsidian) 백업 및 지식 베이스 구축이 가능하도록 하기 위함임.

---
*시스템의 일관성을 위해 위 규칙에서 벗어난 코드는 작성이 금지됩니다.*
