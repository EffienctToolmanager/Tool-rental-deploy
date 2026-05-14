---
session_id: "e6e1c659-4039-463c-b059-c0ff3e6fc217"
task_type: "Knowledge Engineering & Automation"
tech_stack: ["Python", "Ollama (Gemma4)", "watchdog", "Obsidian", "Streamlit", "COM Automation"]
date: 2026-05-02
status: "Completed"
---

# [Instruction]
"Andre Karpathy의 LLM-Wiki 철학을 바탕으로, 사용자가 `00_Raw` 폴더에 던진 파편화된 정보를 자동으로 읽어 (1) 의미론적 분류, (2) 지식 간 연결, (3) 대시보드 요약을 수행하는 'P-Reinforce' 자율 지식 엔진을 구축해줘. 또한, 사내 장비 대여를 위한 Streamlit 앱과 Outlook 연동 기능을 추가해줘."

# [Context Analysis]
1. **자율성(Autonomy)의 정의**: 단순한 챗봇이 아니라, 백그라운드에서 24시간 폴더를 감시하며 인간의 개입 없이 지식을 가꾸는 '정원사' 모델 지향.
2. **기술적 난제 (Obsidian Sync 이슈)**: 옵시디언은 새 파일 생성 시 0.1초간 빈 파일을 먼저 생성함. 기존 스크립트가 이를 즉시 읽어 '내용 없음'으로 판단하는 버그 발생.
3. **Outlook 연동 제약**: 'New Outlook'은 레거시 COM Automation을 지원하지 않음 -> 'Classic Outlook'으로의 전환 가이드 필요.

# [Chain of Thought]
1. **지식 처리 파이프라인 (3-Layer)**:
   - `agent.py`: 파일 시스템 감시 및 이벤트 핸들링 (Debounce 적용).
   - `brain.py`: Ollama(Gemma4:e4b)를 통한 지식 추출 및 마크다운 변환.
   - `meta_manager.py`: 지식 그래프(`Graph.json`) 및 통합 인덱스(`Index.md`) 관리.
2. **버그 해결 (Debounce Timer)**:
   - `on_created` 이벤트 발생 시 즉시 처리하지 않고, 특정 시간(예: 1초) 동안 `on_modified`가 멈출 때까지 대기한 후 최종 내용을 읽도록 설계 변경.

# [Implementation Snippets]

### 1. 옵시디언 동기화 대응 디바운스 로직 (agent.py)
```python
class RawFolderHandler(FileSystemEventHandler):
    def __init__(self):
        self.timers = {}

    def process_file(self, filepath):
        # 일정 시간 대기 후 파일이 완전히 저장되었을 때 Ollama 호출
        time.sleep(1) 
        content = read_file(filepath)
        if content.strip():
            brain.process(content)
```

### 2. Outlook 메일 자동 발송 (app.py)
```python
import win32com.client as win32

def send_outlook_email(subject, body):
    outlook = win32.Dispatch('outlook.application')
    mail = outlook.CreateItem(0)
    mail.Subject = subject
    mail.Body = body
    mail.To = "user@example.com"
    mail.Send()
```

# [Final Outcome]
- **성공**: 24시간 작동하는 자율 지식 수확 엔진(P-Reinforce) 가동.
- **최적화**: `Index.md`를 단순 목차가 아닌 '자동화 로그 대시보드'로 승격시켜 사용자 피드백 루프 형성.
