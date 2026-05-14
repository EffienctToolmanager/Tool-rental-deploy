---
title: 로컬 AI 코딩 에이전트(Aider/Cline) 구축 및 트러블슈팅
category: Skills
date: 2026-05-03

tags:
  - AI
  - Local-LLM
  - Python
  - VS-Code
  - Troubleshooting
---

# 로컬 AI 코딩 에이전트 구축 가이드

안티그라비티(Gemini)와 협력하여 로컬 PC에 코딩 전용 AI 에이전트를 구축하며 발생한 문제와 해결책을 정리한 지식 문서입니다.

## 1. 개요
단순한 챗봇을 넘어, 로컬 LLM(Ollama 기반 Gemma4)이 내 컴퓨터의 파일을 직접 읽고 수정(Agentic AI)하게 만드는 것이 목표.

## 2. Aider 터미널 구축 시도 및 실패 (Python 3.13 이슈)
- **증상**: 터미널에서 `pip install aider-chat` 명령어 실행 시 `numpy`, `pkgutil.ImpImporter` 관련 에러 발생.
- **원인**: 윈도우 스토어 버전의 최신 Python 3.13 버전에서 삭제된 옛날 문법을 Aider의 하위 의존성 패키지들이 요구하여 충돌 발생.
- **해결(우회)책**: 최신 3.13 대신 가장 안정적인 **Python 3.10 버전**을 시스템에 추가 설치하고, 이를 기반으로 가상환경(`.venv`)을 구축하여 해결.

### 파이썬 3.10 기반 Aider 실행 명령어
```powershell
# 1. Ollama 내부 API 주소 등록 (필수)
$env:OLLAMA_API_BASE="http://127.0.0.1:11434"

# 2. 파이썬 3.10 버전으로 Aider 실행
py -3.10 -m aider --model ollama/gemma4:e2b
```

## 3. 궁극의 해결책: VS Code 확장 프로그램 (Cline / Roo Code)
터미널 기반(Aider)의 까만 화면과 파이썬 환경 세팅의 번거로움을 완전히 없애기 위해, VS Code의 자체 GUI 확장 프로그램인 **Cline**을 도입함.

- **장점**: 파이썬 에러로부터 완벽히 자유로움.
- **작동 방식**: 왼쪽 사이드바에 전용 채팅창이 열리며, 로컬 AI가 기존 코드와 수정될 코드를 시각적으로(Diff) 비교해주고 클릭 한 번(Accept)에 적용 가능.
- **유튜버 세팅 완성**: 바이브코딩 유튜버가 제시한 로컬 AI 에이전트 환경의 완성형. 안티그라비티(설계/기획) + Cline(실제 코드 타이핑) 조합으로 완벽한 분업화 달성.

## 4. 기타 보안 권한 에러 트러블슈팅
VS Code 터미널에서 `이 시스템에서 스크립트를 실행할 수 없으므로...` 보안 에러 발생 시 해결법:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```
위 명령어로 윈도우 전체의 터미널 스크립트 보안 제한을 영구적으로 해제하여 해결.
