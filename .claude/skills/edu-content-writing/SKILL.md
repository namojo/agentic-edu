---
name: edu-content-writing
description: 비전공자 친화적인 AI 교육 모듈 본문 작성 스킬. 각 모듈의 이론+실습을 "팀원에게 주는 업무 매뉴얼" 비유를 써서 풍성하게 풀고, 파일 관리 MCP/Skill 실습과 뉴스 멀티에이전트 캡스톤의 step-by-step을 완성도 높게 작성. "모듈 본문 쓰기 / 실습 가이드 작성 / 교안 보강 / 내용 더 쉽게 / 실습 스텝 다시 써줘" 요청에 트리거.
---

# 교육 콘텐츠 작성 스킬

`content-writer` 에이전트가 쓰는 본문 집필 스킬.

## 왜 이 스킬이 필요한가

기술 교육 콘텐츠는 두 가지 실패 패턴에 빠진다: (1) 용어를 그대로 쓴 채 "직관적으로 이해될 것"이라 가정, (2) 실습 step에서 물리적 동작("어느 창에서 어떤 키")을 생략. 이 스킬은 이 두 지점을 막기 위해 **용어 번역 규칙**과 **물리적 step 원칙**을 강제한다.

## 본문 작성 규칙

### 톤
- 존댓말 강의록 톤 ("해봅시다", "해보면 됩니다"). 반말·영어 혼용 금지.
- 문장 길이: 평균 60자 이하. 접속사 반복 회피.
- 이모지는 `✅`, `⚠️`, `💡` 세 종류만. 과다 사용 금지.

### 용어 번역 원칙
용어가 첫 등장할 때 반드시 "괄호 안 원어" + "한 줄 비유" + "실제 예시" 세 요소를 같이 제시한다.

> 예: "Agent(전담 업무 비서)는 특정 목적을 받아 혼자서 일을 해내는 작은 AI 프로그램입니다. 예를 들어 '받은 메일 요약 Agent'는 메일함을 열고 오늘 온 10개를 3줄로 요약해주는 도우미입니다."

`curriculum-design` 스킬이 만든 `GLOSSARY.md`와 100% 일치해야 한다.

### 실습 Step 원칙
각 step은 아래 4요소를 포함:
1. **어디서** — "Cursor 왼쪽 사이드바에서 ..."
2. **무엇을** — "`create-skill` 명령을 선택"
3. **무엇을 입력** — 붙여넣기 가능한 코드/텍스트 블록
4. **무엇을 기대** — "왼쪽 목록에 `file-organizer` 항목이 생깁니다"

실습 step은 최대 8개. 더 많으면 하위 step으로 분절.

### 실수 시나리오 선반영
각 모듈 끝에 `## 자주 막히는 지점` 섹션. 예상 에러 메시지 3개 이상. 비전공자가 Google에서 한국어로 검색해도 나오지 않을 만한 것을 우선.

## 모듈별 특화 규칙

### 모듈 01 (바이브코딩)
- Cursor 설치: macOS/Windows 각각 다운로드 URL + 설치 확인 방법 (버전 확인 명령)
- Gemini 키 발급: https://aistudio.google.com 진입 → "Get API key" 클릭 → 새 프로젝트 선택 → 키 복사 → Cursor에 붙여넣는 경로 (`Settings > Models` 같은 실제 경로, tech-researcher 결과로 업데이트)
- Hello World: "5살 아이에게 설명하듯 Python의 리스트를 설명해줘" 같은 비전공자 프롬프트 1개

### 모듈 02 (Cursor 투어)
- 기능별 **표 + 20자 이내 대화 예시 1개씩**
- `.cursor/rules/` 디렉터리 구조와 커스텀 규칙 작성 샘플
- Agent 모드 (Background Agent 포함 여부는 `00_tech_research.md` 확인)

### 모듈 03 (Skill 만들기)
- SKILL.md frontmatter 해설
- 실습 A 전반부: **파일 정리 Skill 작성 전체**
  - 동기: "내 다운로드 폴더가 엉망인데 자동 정리 해보자"
  - 규칙 예: 확장자별 폴더 이동, 한국어 파일명 처리, 중복 처리
  - Cursor에 Skill 등록 위치(`~/.cursor/` 관련 경로 — tech-researcher 근거 있는 것만)
  - 테스트 프롬프트 예시

### 모듈 04 (MCP 만들기)
- MCP 3대 구성요소: tools, resources, prompts
- 최소 MCP 서버 샘플 코드 (Python 또는 Node. tech-researcher의 공식 레퍼런스 기준으로 결정)
- 실습 A 후반부: **파일 관리 MCP 서버**
  - tools: `list_files`, `move_file`, `rename_file`, `read_file_safe`
  - 로컬 실행 방법
  - Cursor mcp.json 등록 (공식 경로)
  - Skill vs MCP 차이 Diff 예시

### 모듈 05 (단일 Agent)
- 에이전트 정의의 5요소: 역할·원칙·입력/출력·에러 핸들링·협업
- 보너스 A1 Agent 코드: 이메일/Slack 샘플 데이터 주어지면 요약해주는 Agent
- Subagent 관련 Cursor 용어는 tech-researcher 근거 반영

### 모듈 06 (Multi-Agent)
- 3대 패턴: 파이프라인 / 팬아웃 / 생성-검증
- 보너스 A2: 회의록 입력 → `parser-agent` → `organizer-agent` → 출력
- 메시지 전달 방식: 파일 기반 vs 반환값 기반 설명

### 모듈 07 (캡스톤 뉴스)
아래 필수 섹션을 모두 포함한다:

1. **시나리오**: "오늘 '반도체 수출 통제' 키워드에 대해 한·미 주요 매체가 어떻게 다루는지 30분 안에 브리프"
2. **아키텍처 다이어그램** (ASCII): 사용자 → orchestrator → (kr-news, us-news 병렬) → fact-checker → 리포트
3. **에이전트 4개 정의** — 각 `.md` 예시 파일 풀텍스트
4. **MCP 연결** — Web fetch MCP 또는 Playwright MCP 등 뉴스 수집에 쓰는 MCP 설명
5. **Workflow 실행** — Cursor Agent 모드에서 실행하는 방법
6. **예상 최종 리포트** — 마크다운 템플릿 1개
7. **심화 과제 C1~C3 소개** — 일본 뉴스 Agent 추가 / Playwright로 URL 검증 / 결과 Slack 전송

## 슬라이드 요약 섹션

각 모듈 파일 하단에 `## 슬라이드 요약` 섹션 추가. 3~5개 불릿. 나중에 slide-designer가 슬라이드 타이틀/캡션으로 씀.

## 용어 사전(`GLOSSARY.md`) 갱신

모듈 집필 중 **새 용어 등장 시 즉시 GLOSSARY에 추가**. 다른 모듈에서 이 용어를 다시 쓸 때 비유가 흔들리면 안 된다.

## 정확성 검증

- Cursor·MCP·Gemini 관련 구체적 명령·URL·설정 경로는 반드시 `_workspace/00_tech_research.md`에서 확인. 없으면 "강의 시점 기준 공식 문서 확인 요망" 주석으로 남긴다.
- `create-skill`, `create-subagent` 같은 표현은 Cursor 공식 여부 확인 후 사용. 공식 아니면 실제 명령으로 대체.

## 완료 기준

- [ ] 모든 모듈 파일 생성
- [ ] 모든 모듈에 `자주 막히는 지점` 3개 이상
- [ ] 실습 A·B 체크리스트 완성
- [ ] GLOSSARY.md 용어 12개 이상
- [ ] 각 모듈 `## 슬라이드 요약` 포함
