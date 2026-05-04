---
id: 10844e24-09a3
category: "[[10_Wiki/Projects/AI_Automation]]"
confidence_score: 0.98
tags: [AI, 자동화, 로드맵, Local_AI, Agent, Obsidian, Enterprise_AI, System_Design]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[Integrated AI Automation System Roadmap (Local-First Architecture)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 본 로드맵은 외부 클라우드 의존성을 최소화하고 보안을 최우선으로 하는, 로컬 기반의 통합 AI 시스템을 구축하여 개인 지식 데이터화 및 기업 자동화 워크플로우를 실현하는 청사진이다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** AI 자동화는 보안(로컬 환경), 구조화된 입력(마크다운), 그리고 모듈성(분리된 에이전트 및 앱)을 중심으로 설계되어야 하며, 핵심 목표는 '자동화된 데이터 파이프라인' 구축이다.
- **세부 내용:**
- **전략적 기반:** 외부 클라우드 의존을 지양하고, 보안을 위해 Ollama 등을 활용한 100% 로컬(폐쇄망) 기반 AI 엔진을 필수적으로 사용한다.
- **기업 환경 (Enterprise):** '폴더별 에이전트(Folder Watchdog)'를 구현하여 특정 폴더에 추가되는 비정형 문서(PDF)를 로컬 AI가 자동으로 파싱하고 데이터화하는 기능을 목표로 한다.
- **기업 환경 (Internal Tools):** 기존 클라우드 기반 사내 양식을 대체하기 위해 Streamlit 등을 활용한 자체 사내 웹 애플리케이션(대시보드/챗봇 형태)을 구축한다.
- **개인 환경 (Knowledge Hub):** Obsidian을 중심 지식 허브(Second Brain)로 활용하며, 모든 입력과 결과물은 마크다운 포맷으로 체계적으로 구조화된다.
- **데이터 흐름:** 스크립트 기반의 자동 수집 및 요약 리포트(경제/투자)를 생성한 후, 이를 옵시디언에 자동으로 저장하고 텔레그램 등 메신저로 실시간 알림(Webhook)을 전송하는 완전 자동화 루프를 구축한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** None
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_Automation]]
- **Related:** [[Ollama]], [[Obsidian]], [[Agentic_Workflow]], [[Data_Pipeline]], [[Local_LLM]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
