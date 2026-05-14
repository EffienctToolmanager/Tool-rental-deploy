---
id: 7aeacd58-4fbe
category: "[[10_Wiki/Projects/System_Architecture]]"
confidence_score: 0.98
tags: [AI, 자동화, 로드맵, Local_AI, Obsidian, Agent]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[통합 AI 자동화 시스템 구축 로드맵]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 로드맵은 클라우드 의존성을 배제하고 로컬 기반의 AI 엔진(Ollama)과 옵시디언(Obsidian)을 중심으로, 회사 및 개인 환경에 걸친 통합적인 자동화 및 지식 데이터화 시스템 구축 청사진을 제시한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 보안과 프라이버시를 최우선으로 하는 아키텍처는 외부 클라우드를 배제하고, 로컬 LLM + 마크다운(Markdown) 기반의 지식 그래프 구조를 핵심 원리로 삼는다.
- **세부 내용:**
- **회사 환경 (Enterprise)**: 보안 강화를 위해 100% 로컬(폐쇄망) 기반의 AI 엔진 사용이 필수적이다.
- **회사 환경 - 데이터 파싱**: '폴더별 에이전트(Folder Watchdog)' 기능을 구현하여, 특정 폴더에 추가된 문서(PDF 등)를 AI가 자동 추출 및 데이터화하는 파이프라인이 필요하다.
- **회사 환경 - 사내 앱**: 기존 사내 시스템을 대체할 Streamlit 기반의 자체 웹 앱(대시보드+챗봇) 구축을 목표로 한다.
- **개인 환경 (Personal Datafication)**: Obsidian을 메인 지식 허브(Second Brain)로 사용하여 크로스 디바이스(Windows ↔ Android) 간의 데이터 연결성을 확보한다.
- **지식/생각 자동화**: 모바일에서 생성된 아이디어와 기록을 즉시 Markdown 포맷으로 옵시디언에 통합하는 워크플로우를 구축한다.
- **정보 요약 및 알림**: PC 스크립트를 통해 매일 정기적으로 정보를 수집/요약하여 마크다운으로 저장하고, 이를 텔레그램 등 메신저로 자동 푸시 알림하는 시스템을 설계한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/System_Architecture]]
- **Related:** [[Ollama]], [[Obsidian]], [[AI_Agent]], [[Markdown]], [[Local_Network]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
