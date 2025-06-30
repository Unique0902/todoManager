# 🗂️ todoManager DB 엔터티/필드/관계 요약

## 1. 주요 엔터티 목록
- goal (목표)
- project (프로젝트)
- milestone_group (마일스톤 그룹)
- task (할일)
- other_task (기타 일정)
- routine (루틴)
- aspiration (아이디어/버킷리스트)
- emotion_journal (감정일기)

---

## 2. 각 엔터티별 주요 필드

| 엔터티           | 주요 필드(예시)                                                                                   | 비고/특이사항                  |
|------------------|--------------------------------------------------------------------------------------------------|-------------------------------|
| goal             | id, type, title, parent_id, description, order, created_at, updated_at, deleted, is_milestone     | 트리 중심, 하위 목표 포함      |
| project          | id, type, title, parent_id, description, order, start_date, end_date, is_milestone                | 기간 필수, 하위 goal/루틴 등   |
| milestone_group  | id, type, title, parent_id, order, created_at, updated_at                                         | 자식은 is_milestone: true      |
| task             | id, type, title, parent_id, due_date, checked, is_milestone, milestone_date, order_index          | 체크 가능, milestone 속성      |
| other_task       | id, type, title, parent_id, due_date                                                              | 체크 불가, 캘린더 표시용       |
| routine          | id, type, title, parent_id, start_date, frequency, category, performed_dates, failed_logs, ...     | 반복, 수행률, 난이도, 카테고리 |
| aspiration       | id, type, title, category, importance, linked_goal_id, created_at                                 | 트리와 무관, 아이디어 저장소   |
| emotion_journal  | id, date, content, created_at, mood_tag, linked_routine_id                                        | 감정일기, 사용자 정의 감정     |

---

## 3. 엔터티 간 주요 관계
- goal/project/task/routine: 트리 구조(부모-자식, parent_id)
- milestone_group: 자식 노드는 자동으로 is_milestone: true
- aspiration: 트리와 직접 연결 X, linked_goal_id로 추후 연결 가능
- emotion_journal: routine과 직접 연동 X(추후 확장 가능)

---

## 4. 산출물
- 이 문서는 요구사항 분석/핵심 엔터티 도출 결과를 요약한 자료입니다.
- 다음 단계(ERD 설계)에서 시각화 및 관계 다이어그램 추가 예정 