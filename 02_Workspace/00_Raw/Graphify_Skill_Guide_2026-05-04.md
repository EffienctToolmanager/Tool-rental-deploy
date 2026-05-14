# 스킬 가이드: Graphify 프로젝트 분석 및 시각화 (2026-05-04)

## 1. 개요
[[Graphify]]는 코드 베이스를 분석하여 지식 그래프(Knowledge Graph)를 생성하고, 파일 간의 복잡한 연관 관계를 시각화하는 도구임. 안티그라비티의 핵심 분석 스킬로 등록됨.

## 2. 주요 명령어 (CLI Reference)
| 작업 내용 | 명령어 | 비고 |
| :--- | :--- | :--- |
| **분석 및 업데이트** | `graphify update [경로]` | 프로젝트를 스캔하여 지식 그래프 생성 |
| **실시간 감시** | `graphify watch [경로]` | 코드 변경 시 자동 재분석 |
| **구조 질문** | `graphify query "질문"` | 그래프 기반 코드 구조 질의 |
| **최단 경로 탐색** | `graphify path "A" "B"` | 두 노드 간의 호출 관계 확인 |
| **안티그라비티 연동** | `graphify antigravity install` | 어시스턴트 전용 규칙 및 워크플로우 설정 |

## 3. 산출물 활용
- `graphify-out/graph.html`: 인터랙티브 시각화 그래프.
- `graphify-out/GRAPH_REPORT.md`: 핵심 개념 및 요약 리포트.
- `graphify-out/graph.json`: 전체 그래프 데이터베이스.

## 4. 옵시디언 연동 팁
- `graphify tree` 명령어를 사용하여 옵시디언의 폴더 구조와 유사한 트리 뷰 HTML을 생성할 수 있음.
- [[지식 그래프]] 뷰와 병행하여 코드의 물리적 구조를 파악하는 데 활용.

---
**기록자**: 안티그라비티 (지식 정원사)
**연관 지식**: [[agent.py]], [[meta_manager.py]], [[Obsidian_Optimization]]
