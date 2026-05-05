---
id: ff944bd2-384b
category: "[[10_Wiki/Projects/AI_System_Design]]"
confidence_score: 0.95
tags: [AI, 자동화, Agent, Local_AI, Obsidian, Roadmap]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[로컬 중심의 통합 AI 자동화 시스템 로드맵]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 본 시스템은 보안을 최우선으로 고려하여, 외부 클라우드 의존성을 배제하고 로컬 환경에서 구동되는 LLM과 개인/회사 지식 데이터베이스를 결합한 통합 자동화 아키텍처를 목표로 한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 신뢰할 수 있는 AI 자동화 시스템은 '지식 허브(Knowledge Hub)'를 중심에 두고, 보안이 검증된 '로컬 엔진(LLM)'을 동력원으로 삼아, 다양한 '자동화 모듈(Agents)'을 연결하는 레이어드 아키텍처가 필요하다.
- **세부 내용:**
- **시스템 기본 원칙:** 보안을 위해 회사 및 개인 환경 모두 100% 로컬(폐쇄망) 환경 기반의 AI 엔진(Ollama 등)을 사용해야 함.
- **사내 엔터프라이즈 목표:** 폴더별 Watchdog 에이전트를 구축하여 특정 폴더에 추가된 문서 파일(PDF)을 자동으로 감지, 파싱, 데이터화하여 지식으로 변환하는 자동화 파이프라인 구현.
- **사내 애플리케이션:** 사내 비품 대여 앱 등 기존의 MS/Google Forms를 대체할 수 있는 자체적인 웹 대시보드 형태의 사내 웹 앱(Streamlit 등 활용) 구축.
- **개인 지식 관리 (Obsidian 기반):** Obsidian을 핵심 지식 허브로 활용하여, 다양한 채널(모바일 기록, PC 스크립트)에서 얻은 정보를 마크다운 포맷으로 구조화하고 연동하는 '제2의 뇌'를 구축.
- **자동 데이터 수집 및 전송:** PC 기반 스크립트를 활용해 매일 정기적으로 경제/투자 정보를 수집/요약하고, 그 결과를 옵시디언으로 자동 저장하며, 최종 내용을 텔레그램 등으로 실시간 푸시 알림(Webhook) 전송하는 워크플로우 확립.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** 최신 트렌드가 클라우드 기반의 대규모 LLM API 사용에 집중하는 경향과 달리, 이 로드맵은 최고 수준의 보안을 위해 '완전한 온프레미스/로컬' 환경을 고집하는 것이 핵심적인 설계 결정이다.
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_System_Design]]
- **Related:** [[Ollama]], [[Obsidian]], [[Agentic Workflow]], [[데이터 파싱 자동화]], [[Private Computing]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
