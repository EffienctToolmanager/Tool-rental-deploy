---
id: 5f4e-2a8d-1c9b
category: "[[10_Wiki/Projects/AI_System_Build]]"
confidence_score: 0.95
tags: [AI_연구, 로드맵, 자동화, Ollama, Obsidian, 아이디어]
last_reinforced: 2026-05-02
github_commit: "pending"
---

# [[AI 자동화 시스템 구축 설계 로드맵]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> 회사와 개인 환경을 분리하되, 로컬 LLM(Ollama)과 옵시디언 기반의 데이터 파이프라인을 구축하여 100% 프라이빗한 자동화 에이전트를 실현한다.  

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** 클라우드 의존성을 탈피하고 로컬(폐쇄망) 환경에서 데이터 프라이버시를 보장하는 AI 워크플로우 설계.
- **세부 내용:**
  - **회사 환경 (Enterprise AI):**
    - 100% 로컬 망에서 Ollama와 오픈소스 모델을 활용.
    - 주요 모듈: 특정 폴더의 파일을 파싱하는 **Folder Watchdog**, 사내 비품을 관리하는 **Tool Rental App** (Streamlit 기반).
  - **개인 환경 (Personal Datafication):**
    - **Obsidian**을 Second Brain으로 활용하여 모바일 ↔ PC 간 마크다운 데이터 동기화.
    - 주요 모듈: 매일 자동화된 경제/투자 리포트 수집 및 옵시디언 저장, **Webhook**을 통한 실시간 알림 발송.

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** 지식베이스 초기화 이후 첫 문서이므로 과거 데이터와의 충돌 없음.
- **정책 변화:** 사용자의 메모 원문에 따라 `AI_연구`라는 새로운 카테고리 수요가 감지됨. 정책 가중치에 따라 이를 목표 중심인 `Projects` 하위에 `AI_System_Build` 디렉토리로 신규 생성 및 배치함.

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/Projects/AI_System_Build]]
- **Related:** [[로컬 LLM (Ollama)]], [[Obsidian 활용법]]
- **Raw Source:** [[00_Raw/20260502_AI자동화시스템_로드맵.md]]
