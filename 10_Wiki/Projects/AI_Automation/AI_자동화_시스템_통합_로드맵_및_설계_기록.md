---
id: e67125d4-8471
category: "[[10_Wiki/Projects/AI_Automation]]"
confidence_score: 0.95
tags: [AI, 자동화, 로컬AI, 로드맵, Obsidian, 에이전트]
last_reinforced: 2026-05-05
github_commit: "pending"
---

# [[AI 자동화 시스템 통합 로드맵 및 설계 기록]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 이 시스템은 외부 클라우드 의존도를 최소화하고, 100% 로컬 환경과 Obsidian을 중심으로 회사 및 개인 데이터를 자동화 및 데이터화하는 아키텍처를 제시한다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 개인 정보 보호 및 보안을 최우선으로 하는 '로컬 우선(Local-First)' 아키텍처가 핵심이며, 모든 자동화는 지식 그래프(Obsidian)에 통합되어야 한다.
- **세부 내용:**
- 회사 환경 (Enterprise): 보안을 위해 Ollama와 로컬 오픈소스 모델을 활용하는 폐쇄망 기반 AI 엔진을 구축해야 한다.
- 폴더별 에이전트(Folder Watchdog)를 구현하여, 특정 폴더에 추가된 문서(PDF 등)를 로컬 AI가 자동 파싱 및 데이터화해야 한다.
- 사내 웹 앱(Tool Rental App)은 MS/Google Forms를 대체할 자체 Streamlit 기반 대시보드/챗봇 형태로 개발한다.
- 개인 환경 (Personal): Obsidian을 핵심 지식 허브로 활용하여, 모든 아이디어와 기록을 마크다운 포맷으로 데이터화한다.
- 자동화된 정보 수집(경제/투자 리포트) 스크립트를 PC에 구축하고, 결과를 옵시디언에 자동 저장하는 파이프라인이 필요하다.
- 시스템 통합을 위해 생성된 리포트나 요약본은 텔레그램 등의 메신저를 통해 실시간 푸시 알림(Webhook)으로 연동해야 한다.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** 내부 보안(폐쇄망)과 자동화의 편리성(클라우드/API)을 동시에 추구하므로, 로컬 환경에서의 서비스 통합 난이도가 높아질 수 있다.
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_Automation]]
- **Related:** [[Ollama]], [[Obsidian]], [[AI Agent]], [[Streamlit]], [[Knowledge Graph]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
