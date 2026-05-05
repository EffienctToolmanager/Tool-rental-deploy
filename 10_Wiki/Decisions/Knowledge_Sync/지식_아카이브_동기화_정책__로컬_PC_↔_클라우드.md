---
id: 667310dd-1de9
category: "[[10_Wiki/Decisions/Knowledge_Sync]]"
confidence_score: 1.0
tags: [지식관리, 동기화, Workflow, Google Drive, Knowledge Base]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[지식 아카이브 동기화 정책: 로컬 PC ↔ 클라우드]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 본 정책은 로컬 PC의 고성능 처리 능력과 클라우드 서비스의 높은 접근성을 결합하여, 지식 생성과 소비 사이의 시간적 격차를 제거하는 것을 목표로 한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 가장 효과적인 지식 시스템은 물리적 제약을 최소화하고, 생성 장소와 소비 장소를 일체화하는 것이다.
- **세부 내용:**
- 목적: 로컬(C:)의 고성능 연산 능력과 클라우드(G:)의 높은 접근성을 결합하여 지식 생산/소비의 시차를 제거한다.
- 동기화 경로: Local Source (Dev_Workspace) -> Cloud Destination (Family_Archive).
- 대상 자료 1: `10_Wiki/` - 정제되고 완성된 마크다운 형식의 지식 문서.
- 대상 자료 2: `20_Meta/` - 지식 인덱스(`Index.md`) 및 관계 그래프 데이터(`Graph.json`).
- 기대 효과: 이동 중 휴대폰에서도 AI가 정리한 최신 로그 및 의사결정 사항 즉시 확인 및 가족 아카이브의 자동 최신화 유지.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Decisions/Knowledge_Sync]]
- **Related:** [[지식관리시스템(KMS)]], [[Workflow Automation]], [[PKM]], [[OneDrive 동기화]]
- **Raw Source:** [[00_Raw/Sync_Policy_Implementation_2026-05-04.md]]
