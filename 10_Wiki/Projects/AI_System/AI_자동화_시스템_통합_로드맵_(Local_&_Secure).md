---
id: 3e756164-4bb3
category: "[[10_Wiki/Projects/AI_System]]"
confidence_score: 0.98
tags: [AI, Automation, Local LLM, Roadmap, 지식관리, 엔터프라이즈]
last_reinforced: 2026-05-06
github_commit: "pending"
---

# [[AI 자동화 시스템 통합 로드맵 (Local & Secure)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 로드맵은 보안을 최우선으로 고려하여, 사내외 환경을 아우르는 통합 AI 자동화 시스템을 구축하며, 로컬 LLM과 옵시디언 기반의 지식 허브를 핵심 축으로 삼는다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 신뢰할 수 있는 자동화 시스템은 클라우드 의존성을 최소화하고, 데이터 주권을 확보할 수 있는 로컬 기반 아키텍처(Local-First)를 채택해야 한다.
- **세부 내용:**
- **보안 원칙**: 외부 클라우드 의존성을 배제하고, 100% 로컬(폐쇄망) 환경에서 운영되는 AI 엔진 (Ollama + 오픈소스 모델)을 사용한다.
- **회사 환경 (Enterprise)**: 폴더 단위 파일 모니터링 에이전트(Folder Watchdog)를 구현하여 문서 파싱 및 데이터 자동화를 수행하며, 사내 업무용 웹 앱(Streamlit 기반)을 구축하여 기존 Forms 시스템을 대체한다.
- **개인 환경 (Personal)**: Obsidian을 메인 지식 허브(Second Brain)로 활용하여, 모든 아이디어와 데이터가 Markdown 기반으로 체계적으로 기록되고 동기화된다.
- **데이터 흐름 자동화**: 스크립트를 통해 정기적인 정보 수집 및 요약 리포트를 자동 생성하고, 이를 옵시디언에 마크다운 형태로 저장한다.
- **실시간 알림**: 생성된 요약 보고서나 중요 정보에 대해 텔레그램 등의 메신저로 자동 알림(Webhook)을 발송하는 시스템을 구현한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** 완벽한 로컬 환경 구축은 외부의 최고 수준으로 파워풀한 상용 클라우드 AI 서비스의 편의성을 포기해야 하는 기술적 제약을 수반한다.
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_System]]
- **Related:** [[Ollama]], [[Obsidian]], [[Local LLM Architecture]], [[Agentic Workflow]], [[Datafication]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
