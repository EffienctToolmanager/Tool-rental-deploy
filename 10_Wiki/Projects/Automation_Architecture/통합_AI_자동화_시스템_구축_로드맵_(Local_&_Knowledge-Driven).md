---
id: 9e52c5ff-5411
category: "[[10_Wiki/Projects/Automation_Architecture]]"
confidence_score: 0.98
tags: [AI, 자동화, 로드맵, Local_AI, Obsidian, Agent]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[통합 AI 자동화 시스템 구축 로드맵 (Local & Knowledge-Driven)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 로드맵은 외부 클라우드 의존성을 배제하고, 로컬 AI 엔진과 옵시디언 기반의 지식 허브를 중심으로 회사와 개인 생활 전반에 걸친 통합 자동화 시스템을 구축하는 청사진이다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 최신 자동화 시스템은 중앙 집중식 클라우드 서비스가 아닌, 로컬 제어권을 확보한 에이전트와 개인 지식 그래프(지식 허브)를 중심으로 구축되어야 한다.
- **세부 내용:**
- **보안 원칙:** 모든 시스템은 외부 클라우드 의존을 지양하며, Ollama와 같은 로컬 오픈소스 모델을 사용하여 폐쇄망 환경(Local Only)을 유지해야 한다.
- **엔터프라이즈 환경 (사내):** 특정 폴더 감지 기반 에이전트(Folder Watchdog)를 구현하여, 파일 추가 시 내용 추출, 요약, 데이터 자동화 파싱 기능을 수행한다.
- **사내 서비스 개선:** 기존 양식 기반 시스템을 Streamlit 등으로 대체하여 대시보드와 챗봇 기능을 결합한 맞춤형 웹 앱을 구축한다.
- **개인 지식 허브:** Obsidian을 핵심 지식 기반(Second Brain)으로 삼고, 모든 아이디어와 정보는 마크다운 포맷으로 옵시디언에 즉각적으로 통합(Datafication)한다.
- **정보 자동 흐름:** PC 기반 스크립트를 활용하여 정기적으로 정보를 수집/요약하고, 이 결과를 옵시디언에 자동 저장하며, 텔레그램/메신저를 통해 실시간 알림(Webhook)을 구현한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None (이는 보안 최우선 원칙에 따라 외부 클라우드를 의도적으로 배제하는 설계 제약조건을 명확히 설정하고 있음)
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/Automation_Architecture]]
- **Related:** [[Obsidian]], [[Ollama]], [[Agentic_Workflows]], [[Local_LLM_Deployment]], [[Webhook_System]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
