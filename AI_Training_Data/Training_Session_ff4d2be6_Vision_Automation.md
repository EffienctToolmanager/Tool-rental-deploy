---
session_id: "ff4d2be6-adb9-428b-9876-667d2bce34e5"
task_type: "Local AI Vision & Python Env Setup"
tech_stack: ["Ollama", "Python 3.10", "watchdog", "MiniCPM-V", "LLaVA", "Aider"]
date: 2026-05-02
status: "Completed"
---

# [Instruction]
"Ollama를 활용하여 특정 폴더에 이미지가 들어오면 자동으로 모델을 스위칭(Admin용/Study용)하여 OCR 및 분석을 수행하는 시스템을 구축해줘. 또한, 최신 파이썬 버전에서의 라이브러리 충돌 문제를 해결하고 Aider와 같은 로컬 에이전트 환경을 구성해줘."

# [Context Analysis]
1. **모델 선정의 시행착오**:
   - `Moondream`: 속도는 빠르나 해상도가 낮아 영수증 OCR 실패.
   - `LLaVA`: 영문 인식은 좋으나 한글 영수증에서 환각(Hallucination) 발생.
   - `MiniCPM-V`: 아시아권 언어 최적화 모델로 선정하여 한글 OCR 정확도 개선 시도.
2. **환경적 제약**: 
   - Google Drive 가상 드라이브(`G:`)에서는 일반 파일 감지가 안 되는 현상 발견 -> `PollingObserver`로 해결.
   - Python 3.13의 `pkgutil` 속성 제거 이슈로 인한 `aider` 설치 실패 -> Python 3.10 병행 설치 및 `py -3.10` 명령어 강제화.

# [Chain of Thought]
1. **비전 파이프라인**: 
   - `watchdog` 라이브러리를 사용하여 실시간 감시.
   - Admin 폴더(MiniCPM-V: JSON 추출)와 Study 폴더(LLaVA: 맥락 분석)로 로직 분기.
2. **안정적인 런타임 구축**:
   - `winget`을 통해 시스템 전역에 영향을 주지 않고 Python 3.10 설치.
   - 가상환경(`.venv`) 내에서 의존성 격리.
3. **UI/UX 최적화**:
   - `.vscode/settings.json`을 조작하여 개발용 숨김 파일(`.git`, `.venv`)을 탐색기에서 제거, 사용자 인지 부하 감소.

# [Implementation Snippets]

### 1. Google Drive 호환 폴더 감시 (vision_agent.py)
```python
from watchdog.observers.polling import PollingObserver

# 일반 Observer 대신 Polling 방식 사용 (가상 드라이브 호환성)
observer = PollingObserver()
observer.schedule(event_handler, path=DIR_TO_WATCH, recursive=False)
```

### 2. 특정 버전 파이썬 강제 실행 (Aider)
```powershell
# 최신 버전 충돌 회피를 위한 3.10 런타임 지정 실행
py -3.10 -m aider --model ollama/gemma4:e2b
```

# [Final Outcome]
- **성공**: 로컬 기반의 시각 지능 자동화 파이프라인(Vision-to-Wiki) 기초 완성.
- **해결**: 복잡한 파이썬 환경 구축을 `winget`과 가상환경 전략으로 자동화하여 설치 지옥 탈출.
