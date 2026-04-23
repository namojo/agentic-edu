---
name: edu-site-orchestrator
description: 삼성SDS Agentic AI 교육 사이트를 빌드·업데이트하는 통합 오케스트레이터. "교육 사이트 만들어줘 / 수정해줘 / 커리큘럼 재구성 / 모듈 추가 / 슬라이드 재생성 / 뉴스 멀티에이전트 실습 보강 / 사이트 디자인 개선 / 파일 관리 실습 보완 / 다시 빌드 / 재실행 / 업데이트" 같은 요청에 반드시 트리거. 단순 질문은 직접 응답 가능.
---

# 교육 사이트 오케스트레이터

삼성SDS 비전공자 대상 "Agentic AI 개발 1회차" 교육 사이트를 6명 에이전트 팀으로 빌드/유지하는 통합 지휘자.

## Phase 0 — 컨텍스트 확인 (필수 첫 단계)

1. `_workspace/` 존재 여부 확인
2. 분기:
   - **초기 실행**: `_workspace/` 없음 → Phase 1부터 전체 실행
   - **새 실행**: 사용자가 새로운 대규모 입력 → 기존 `_workspace/`를 `_workspace_prev_{timestamp}/`로 옮기고 Phase 1부터
   - **부분 재실행**: 특정 모듈/슬라이드/페이지 수정 요청 → 해당 에이전트만 재호출하고 `_workspace/CHANGELOG.md`에 기록
3. 사용자가 워크플로우 수정 희망을 표시한 기록(`memory/feedback_harness_plan_before_build.md`)이 있으면 **주요 페이즈 진입 직전 확인 요청**을 반드시 넣는다.

## 실행 모드

**하이브리드(서브 에이전트 중심)**. 에이전트 팀 단일체보다 Phase별 서브 호출이 더 명료하다. 이유: 각 Phase의 인풋/아웃풋이 명확한 파일 산출물이어서 실시간 통신 필요성이 낮다.

## Phase 1 — 리서치 + 커리큘럼 골격 (병렬 서브)

**목표:** 최신 Cursor/MCP 정보 확보 + 7개 모듈 구조 확정.

동시에 두 개 서브에이전트 호출(`run_in_background: true`):

1. `Agent(tech-researcher, model: "opus")` — `_workspace/00_tech_research.md` 산출
2. `Agent(curriculum-architect, model: "opus")` — `_workspace/01_curriculum.json` 산출

둘 다 완료 후, `curriculum-architect`를 1회 추가 호출해 `tech-researcher` 결과를 커리큘럼에 반영(모듈 02 최신화).

**체크포인트:** 사용자에게 커리큘럼 요약 제시 후 "콘텐츠 작성 진입해도 될까요?" 확인.

## Phase 2 — 모듈 본문 작성 (순차 서브)

**목표:** 7개 모듈 본문 + 실습 A(파일 관리 MCP/Skill) + 캡스톤(뉴스 멀티에이전트) 본문 완성.

`Agent(content-writer, model: "opus")`를 **1회 호출**하여 모든 모듈을 한 번에 작성하게 한다. 이유: 모듈 간 용어·난이도 일관성이 중요하므로 분리 호출은 일관성 리스크.

입력 파일: `_workspace/00_tech_research.md`, `_workspace/01_curriculum.json`.
출력: `_workspace/02_modules/*.md` + `_workspace/GLOSSARY.md`.

추가 본문 요구:
- 모듈 05 끝: **보너스 A1 - 이메일/Slack 요약 Agent**
- 모듈 06 도입: **보너스 A2 - 회의록→액션아이템 2인 Agent**
- 모듈 03 또는 02 끝: **보너스 A3 - CSV 요약봇**
- 모듈 07 하단: **심화 과제 C1~C3 소개** (구현 안 함, 아이디어만)

**체크포인트:** 간단 요약("N개 모듈, 총 단어수 ~") 보고 후 슬라이드+프론트로 진입.

## Phase 3 — 슬라이드 + 프론트엔드 (병렬 서브)

**목표:** 슬라이드 이미지 생성 + 사이트 골격 빌드를 병렬로.

동시에 두 개 호출:

1. `Agent(slide-designer, model: "opus", run_in_background: true)` — Gemini 이미지 생성. 최대 14장.
2. `Agent(frontend-builder, model: "opus", run_in_background: true)` — `site/` 생성. 슬라이드 경로는 `_workspace/03_slides.json`에서 찾고, 미완이면 fallback 카드로 대체하도록 구현.

슬라이드 완료 후, `frontend-builder`가 `_workspace/03_slides.json`을 최신 상태로 다시 읽게 하는 `postprocess: rebuild_slide_index` 단계를 지시한다. 파일 경로만 업데이트되므로 전체 재빌드 아님.

## Phase 4 — QA + 리파인 (서브 반복)

`Agent(qa-reviewer, model: "opus")` 호출. `_workspace/04_qa_report.md` 산출.

Critical 이슈 있으면 담당 에이전트(content-writer / slide-designer / frontend-builder) 중 해당자만 재호출해 수정. 수정 후 qa-reviewer 재호출해 Critical만 재확인.

Major 이슈는 사용자 결정에 맡긴다(보고만).

## 데이터 전달 프로토콜

- **파일 기반**(주). 모든 중간 산출물은 `_workspace/`에 저장.
- **반환값 기반**(보조). 서브 에이전트가 상위 오케스트레이터에 완료/실패·주요 수치 요약을 반환.

파일 컨벤션:
- `_workspace/00_tech_research.md`
- `_workspace/01_curriculum.json`
- `_workspace/02_modules/{id}.md` — id는 `01-vibe-coding` 등 모듈 순번 포함
- `_workspace/03_slides.json`
- `_workspace/04_qa_report.md`
- `_workspace/CHANGELOG.md` — 모든 변경 이벤트 1줄 로그
- `_workspace/GLOSSARY.md` — 용어 사전

## 에러 핸들링

| 유형 | 처리 |
|------|------|
| 서브 에이전트 실패 | 1회 재시도. 재실패 시 해당 산출물 공란으로 두고 QA에 "누락"으로 표시. 사용자에 보고. |
| 슬라이드 생성 실패 | 해당 슬라이드만 `fallback: true`로 표시. frontend-builder가 CSS 카드로 대체. |
| 커리큘럼 ↔ 모듈 ID 불일치 | qa-reviewer가 감지 → content-writer 재호출. |
| 용어 불일치 | content-writer에게 `GLOSSARY.md` 업데이트 + 전 모듈 re-review 지시. |

## 팀 크기 가이드라인 준수

6명 · 대규모 작업. Phase 단위로 2~3명만 동시 활성. 모든 Agent 호출에 `model: "opus"` 명시.

## 테스트 시나리오

**정상 흐름:** 사용자가 "사이트 만들어줘" → Phase 1~4 순차 실행 → `site/index.html` 정적 서버로 동작 확인 → QA 리포트 Critical 0건.

**에러 흐름:** Phase 3에서 슬라이드 3장 생성 실패 → `fallback: true` 설정 → frontend-builder가 CSS 카드로 렌더 → QA가 "3장 대체 렌더 중" Minor 기록 → 사용자 결정에 따라 재시도 또는 유지.

## 후속 작업 예시 트리거

- "모듈 03 내용 더 쉽게 풀어줘" → Phase 2만 content-writer로 부분 재호출
- "슬라이드 전체 다시 생성" → Phase 3 slide-designer만 재호출
- "뉴스 멀티에이전트 캡스톤에 일본 뉴스 Agent 추가" → curriculum-architect로 모듈 07 수정 후 content-writer 재호출
- "디자인이 템플릿과 좀 달라 보임" → frontend-builder 디자인 토큰 재점검 + QA 재실행

## 참고

- 에이전트 정의: `.claude/agents/*.md`
- 스킬: `.claude/skills/{curriculum-design, edu-content-writing, slide-generation, template-frontend-build, edu-content-review}/SKILL.md`
