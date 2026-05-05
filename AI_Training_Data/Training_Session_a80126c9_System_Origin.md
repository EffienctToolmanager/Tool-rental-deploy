---
session_id: "a80126c9-c606-4227-9463-c7552ab929d8"
task_type: "System Origin & Document Standardization"
tech_stack: ["Ollama", "PowerShell", "CSV/Excel", "Obsidian", "Regular Expressions"]
date: 2026-05-01
status: "Completed"
---

# [Instruction]
"가족 아카이브에 있는 무분별한 신분증 스캔본들을 (1) 발급일 기준 파일명 표준화, (2) 주민번호 뒷자리 마스킹 처리, (3) 옵시디언 마크다운 구조화, (4) 엑셀 색인 파일 생성을 통해 자동 정리해줘. 또한, 로컬 Ollama 모델과 Antigravity를 연동하기 위한 파워쉘 통신 환경을 구축해줘."

# [Context Analysis]
1. **환경적 특이성**: Windows PowerShell은 UTF-8 인코딩 처리에 취약하여 한글 깨짐 및 따옴표 이스케이프 오류가 빈번함.
2. **보안 요구사항**: 개인정보(주민등록번호)를 다루므로 로컬 외부로 데이터가 유출되지 않도록 '마스킹' 로직이 필수적임.
3. **사용자 니즈**: 휘발되는 AI와의 대화 기록을 '지식'으로 자산화하고 싶어 함 -> `AI_연구` 폴더의 탄생 배경.

# [Chain of Thought]
1. **통신 안정화 (query.ps1)**: 
   - 터미널 직접 명령 대신 `temp_prompt.json`을 매개체로 사용하여 인코딩 오류 원천 차단.
   - `Invoke-RestMethod`를 사용하여 로컬 서버 응답성 확보.
2. **데이터 거버넌스**:
   - 파일명: `YYYYMMDD_이름_문서종류.확장자` 규칙 적용.
   - 마크다운: YAML Frontmatter를 활용한 옵시디언 그래프 뷰 최적화.
3. **자산화**: 
   - 대화 요약본을 마크다운으로 추출하여 `00_Raw`에 자동 저장하는 로직의 프로토타입 설계.

# [Implementation Snippets]

### 1. 한글 깨짐 방지용 파워쉘 통신 스크립트 (query.ps1)
```powershell
$json = Get-Content -Raw -Path "temp_prompt.json" -Encoding UTF8
$response = Invoke-RestMethod -Uri "http://localhost:11434/v1/chat/completions" -Method Post -ContentType "application/json; charset=utf-8" -Body $json
$response.choices[0].message.content
```

### 2. 주민번호 마스킹 및 옵시디언 템플릿
```markdown
---
tags: [신분증, 증명서, 김태규]
date_issued: 2026-04-26
---
# 주민등록표(등본) - 김태규
- **주민등록번호**: 800101-******* (보안 마스킹 완료)
- **원본 링크**: [[20260426_김태규_주민등록표등본.pdf]]
```

# [Final Outcome]
- **성공**: 파편화된 가족 문서 80% 이상 자동 정리 및 데이터베이스화 완료.
- **시작**: P-Reinforce 지식 엔진의 설계 로드맵(`AI_연구`) 최초 수립.
