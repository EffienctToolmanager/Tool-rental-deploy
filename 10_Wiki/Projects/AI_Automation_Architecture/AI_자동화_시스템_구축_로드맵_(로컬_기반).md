---
id: b8389275-76c3
category: "[[10_Wiki/Projects/AI_Automation_Architecture]]"
confidence_score: 0.98
tags: [AI, 자동화, Ollama, 로컬, Obsidian, Agent, 워크플로우]
last_reinforced: 2026-05-04
github_commit: "pending"
---

# [[AI 자동화 시스템 구축 로드맵 (로컬 기반)]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 회사 및 개인 환경 모두를 아우르는 통합 AI 자동화 시스템의 청사진은 보안을 위해 외부 클라우드를 배제하고 로컬 기반의 에이전트워크플로우를 구축하는 데 중점을 둔다.

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 성공적인 AI 자동화 시스템은 환경별(회사/개인) 요구사항을 명확히 하고, 외부 의존성(클라우드, 불분명 API)을 제거하여 로컬 및 마크다운 중심의 아키텍처를 구축하는 것이 핵심이다.
- **세부 내용:**
- 회사 환경: 보안 문제로 인해 100% 로컬(폐쇄망) 환경 기반의 AI 엔진 사용(Ollama + 오픈소스 모델)을 전제로 한다.
- 회사 에이전트 아이디어: '폴더별 에이전트(Folder Watchdog)'를 통해 특정 폴더의 파일(PDF 등) 자동 파싱 및 데이터화하는 기능 구현.
- 사내 웹 앱 구축: 기존 양식 대체용 사내 웹 앱(대시보드+챗봇 형태)을 자체적으로 Streamlit 등으로 개발하는 것을 제안.
- 개인 지식 허브: Obsidian을 메인 지식 허브(Second Brain)로 삼아 모든 생각과 기록을 마크다운 포맷으로 통합하고 동기화한다.
- 자동화 데이터화: PC 기반 스크립트를 활용하여 경제/투자 리포트를 주기적으로 수집/요약하여 Obsidian에 자동으로 저장하는 워크플로우 설계.
- 실시간 연동: 생성된 리포트나 요약 내용을 텔레그램 등으로 푸시 알림(Webhook) 받아 즉각적인 정보 습득이 가능하도록 구현.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** 없음
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_Automation_Architecture]]
- **Related:** [[Ollama]], [[Obsidian]], [[Agent Workflow]], [[Local LLM Implementation]], [[Data Scraping]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
