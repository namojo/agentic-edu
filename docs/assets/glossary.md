# 용어 사전 (GLOSSARY) — v2

> "Agentic AI 개발 1회차"에서 처음 만나는 용어를 비유와 예시로 정리합니다. 각 모듈 본문의 용어 표기는 이 사전과 **일관**됩니다. 강의 중 헷갈리면 여기로 돌아오세요.

## 표기 원칙

- **원어**는 괄호 안에 병기합니다. 예: "에이전트(Agent)".
- **비유**는 한 줄로, **일상 예시**로 이어서 설명합니다.
- 각 용어는 최초 등장 모듈을 표기하되, 후속 모듈에서 다시 나올 때도 같은 비유를 재사용합니다.
- **Windows 경로를 1순위**로 표기합니다 (`%USERPROFILE%\.cursor\...`). Mac/Linux는 보조.

---

## 1. 바이브코딩 (Vibe Coding)

- **비유**: "AI에게 의도를 말로 던지고 같이 작업하는 방식"
- **풀이**: 전통 코딩이 "문법을 정확히 쓰는 일"이라면, 바이브코딩은 "원하는 결과를 자연어로 묘사하면 AI가 초안을 주고 내가 다듬는" 루프입니다.
- **예시**: "이 CSV를 월별 합계 표로 만들어줘" → Cursor가 코드 초안을 제시 → 내가 검토·수정 → 저장.
- **처음 등장**: 모듈 01.

## 2. Cursor

- **비유**: "AI가 옆자리에 앉아 같이 쓰는 VS Code"
- **풀이**: 에디터 화면에서 Chat·Ask·Agent·Plan 모드로 AI와 대화하면서 코드와 문서를 편집하는 도구. 본 강의는 **Cursor Free 플랜 + 내장 LLM**을 기본 전제로 합니다.
- **처음 등장**: 모듈 00·01.

## 3. Chat / Ask / Agent / Plan 모드

- **비유**: Cursor 채팅 창의 네 모드. 파일 편집 자율성이 다릅니다.
  - **Chat**: 일상 대화, 소규모 수정 (Apply로 반영)
  - **Ask**: 읽기 전용 컨설턴트 (파일 수정 불가)
  - **Agent**: 자율 실행 (멀티파일 편집, 터미널 실행)
  - **Plan**: 먼저 계획을 세우고 승인 후 실행
- **풀이**: `Shift+Tab`으로 순환 전환. 일부 Cursor 버전은 'Manual' 등 다른 이름으로 표시될 수 있음. **메뉴에서 동작으로 선택**.
- **처음 등장**: 모듈 02.

## 4. Tab 자동완성

- **비유**: "타이핑 중 다음 줄을 귀띔해주는 AI"
- **풀이**: Cursor 자체 Fusion 모델이 입력 중 코드의 다음 줄을 예측해 회색으로 표시. **Tab** 키를 눌러 확정.
- **처음 등장**: 모듈 01.

## 5. Apply 버튼

- **비유**: "Chat의 제안을 실제 파일에 꽂는 파란 버튼"
- **풀이**: Chat 응답의 코드 블록 상단에 나타나는 Apply(또는 Accept) 버튼. 클릭하면 해당 내용이 명시된 파일에 반영됨.
- **처음 등장**: 모듈 01.

## 6. Rules (규칙)

- **원어**: Rules (`.cursor\rules\*.mdc`)
- **비유**: "사내 규정집 — 모든 대화에 자동으로 붙는 주의사항"
- **풀이**: Cursor가 매 프롬프트마다 읽는 항상 적용되는 지침. 프로젝트 규칙(`.cursor\rules\`)과 사용자 규칙(전역)이 있고, `.mdc` 파일에는 frontmatter로 범위를 제한할 수 있습니다. (구 명칭 "Rules for AI"는 레거시)
- **처음 등장**: 모듈 02.

## 7. Skill (스킬)

- **원어**: Agent Skills (`SKILL.md`)
- **비유**: "특정 상황이 오면 펼치는 업무 매뉴얼 1장"
- **풀이**: Rules가 항상 켜져 있는 규정집이라면, Skill은 "서랍에 넣어둔 매뉴얼". 설명(description)의 트리거 표현이 사용자 요청과 맞물리면 AI가 꺼내서 펼칩니다.
- **저장 위치 (Windows)**: 프로젝트 `<project>\.cursor\skills\<이름>\SKILL.md`, 전역 `%USERPROFILE%\.cursor\skills\<이름>\SKILL.md`.
- **처음 등장**: 모듈 03.

## 8. MCP (Model Context Protocol)

- **원어**: Model Context Protocol (스펙 2025-11-25)
- **비유**: "AI를 위한 USB-C — 어떤 프로그램에도 꽂을 수 있는 표준 플러그"
- **풀이**: AI가 외부 도구·데이터를 쓰도록 해주는 규격. "손과 발". Skill이 "어떻게 할지"의 매뉴얼이라면, MCP는 "실제로 그 일을 해내는 도구 꾸러미".
- **구성**: Host(Cursor) ↔ Client ↔ Server(능력 제공자). Server는 Tools·Resources·Prompts 세 가지를 내놓습니다.
- **처음 등장**: 모듈 04.

## 9. Tool (툴)

- **비유**: "MCP 서버가 내놓는 개별 버튼 하나"
- **풀이**: MCP 서버가 제공하는 실행 가능한 함수. 예: `list_files`, `move_file`, `fetch_url`. AI가 버튼을 누르면 해당 함수가 실제로 돌아갑니다.
- **처음 등장**: 모듈 04.

## 10. Agent (에이전트) / Subagent

- **원어**: Agent / Subagent (`.cursor\agents\<이름>.md`)
- **비유**: "특정 업무를 맡긴 전담 비서 한 명"
- **풀이**: 역할(role) + 원칙(principles) + 도구 접근 권한(tools) + 정지 조건(stop condition)을 묶은 작은 AI 프로그램. 혼자서 다단계로 일을 수행합니다.
- **예시**: "받은 메일 요약 비서(email-summarizer)", "회의록 정리 비서".
- **저장 위치 (Windows)**: 프로젝트 `<project>\.cursor\agents\<이름>.md`, 전역 `%USERPROFILE%\.cursor\agents\<이름>.md`.
- **처음 등장**: 모듈 05.

## 11. Prompt (프롬프트)

- **비유**: "비서에게 오늘 무엇을 어떻게 할지 적어준 쪽지"
- **풀이**: AI에게 주는 지시문. 좋은 프롬프트 4요소는 역할·목표·제약·출력형식.
- **처음 등장**: 모듈 02.

## 12. Multi-Agent (멀티 에이전트)

- **비유**: "비서들이 모인 소규모 태스크포스 — 서로 산출물을 넘겨가며 일한다"
- **풀이**: 두 명 이상의 Agent가 역할을 나눠 협업하는 구조. 주요 패턴은 릴레이·병렬·합의·오케스트레이터 4종.
- **처음 등장**: 모듈 06.

## 13. Orchestrator (오케스트레이터)

- **비유**: "팀장 에이전트 — 하위 비서들에게 업무를 나누고 결과를 모아 최종 보고서를 낸다"
- **풀이**: 사용자의 요청을 받아 다른 Agent들에게 작업을 분배하고, 결과를 합쳐서 최종 산출물을 생성합니다. 병렬 실행·재시도·중복 제거가 주 책임.
- **처음 등장**: 모듈 06·07.

## 14. Workflow (워크플로우)

- **비유**: "여러 단계 업무를 순서대로 묶은 표준 작업 흐름"
- **풀이**: Agent 여러 개와 MCP 도구를 조합한 한 번의 End-to-End 실행 경로. 예: "키워드 입력 → 뉴스 수집(병렬) → 팩트체크 → 리포트".
- **처음 등장**: 모듈 07.

## 15. Sampling (샘플링)

- **비유**: "MCP 서버가 '이 판단은 AI에게 물어주세요'라고 Host에 다시 부탁하는 기능"
- **풀이**: MCP 클라이언트 측 기능 중 하나. Server가 단순 데이터 리턴을 넘어, LLM 추론이 필요한 중간 판단을 Host에 위임할 수 있게 해줍니다. 본 강의 실습에서는 직접 다루지 않지만 MCP 스펙 상 중요한 개념입니다.
- **처음 등장**: 모듈 04 (개념 언급).

## 16. Gemini API

- **비유**: "Google이 운영하는 모델 콜센터 — 요청을 넣으면 답을 돌려준다"
- **풀이**: Google AI Studio에서 발급한 키로 호출하는 LLM API. 본 강의는 Cursor 내장 LLM과 **별도**로, 터미널·Python 스크립트에서 `google-genai` SDK를 써서 호출합니다. (Cursor Free 플랜은 Gemini BYOK 미지원)
- **처음 등장**: 모듈 00·01.

## 17. Plan C (플랜 C, 강의 규약)

- **비유**: "두 탈것을 섞어 타기 — Cursor로는 IDE 경험을, Gemini로는 순수 API 실습"
- **풀이**: 본 강의의 학습 경로 규약. Cursor Free + 내장 LLM(대화·편집)은 기본 환경, Gemini API는 별도 터미널(Python)로 호출합니다. BYOK 가정 없음.
- **처음 등장**: 모듈 01.

## 18. venv (가상환경)

- **비유**: "이 프로젝트 전용 작은 Python 작업실"
- **풀이**: Python의 프로젝트별 격리된 패키지 공간. `python -m venv .venv` 후 `.\.venv\Scripts\Activate.ps1`(Windows)로 활성화. 프롬프트 앞 `(.venv)` 표시가 "활성화됨" 신호.
- **처음 등장**: 모듈 00.

## 19. GEMINI_API_KEY (환경변수)

- **비유**: "내 Gemini 비밀번호를 Windows 주머니에 영구 보관"
- **풀이**: `[Environment]::SetEnvironmentVariable('GEMINI_API_KEY', '...', 'User')` 또는 시스템 속성 GUI로 등록. 모든 PowerShell·Cursor·스크립트가 공유.
- **처음 등장**: 모듈 00.

## 20. Mermaid

- **비유**: "마크다운으로 그리는 다이어그램"
- **풀이**: 코드블록으로 작성하면 자동으로 플로우차트·시퀀스·상태도로 렌더링되는 다이어그램 언어. 본 강의 모듈 본문과 리포트 사이트(`docs/`)에서 아키텍처·데이터 흐름 표현에 사용합니다.
- **처음 등장**: 모듈 03.

## 21. docs/ (GitHub Pages)

- **비유**: "깃허브가 공개 웹사이트로 올려주는 폴더"
- **풀이**: GitHub 저장소의 `docs/` 폴더는 GitHub Pages 공식 지원 경로. 빈 `.nojekyll` 파일로 Jekyll 처리를 차단하고, 상대 경로만 써야 서브폴더 publish가 정상 작동.
- **처음 등장**: 사이트 배포 맥락 (교안 전반의 외부 레퍼런스).

## 22. file-organizer / file-manager-mcp / email-summarizer / meeting-notes-extractor / news-multiagent

- **비유**: "오늘 실습에서 만드는 5개 프로젝트의 표준 폴더명"
- **풀이**: 모든 실습 폴더는 영문 소문자+하이픈으로 통일합니다. 한글 폴더명은 터미널·GitHub 호환성 문제를 일으키기 쉬워 본 강의는 영어로 표기.
  - `file-organizer` — 모듈 03 Skill
  - `file-manager-mcp` — 모듈 04 MCP 서버
  - `email-summarizer` — 모듈 05 단일 Agent
  - `meeting-notes-extractor` — 모듈 06 Multi-Agent
  - `news-multiagent` — 모듈 07 캡스톤
- **처음 등장**: 모듈 03~07 각각.

---

## 참고 약어

- **BYOK**: Bring Your Own Key — 자체 API 키를 에디터에 등록해 쓰는 방식. Cursor Free에서는 사용 불가.
- **RPM / RPD**: Requests Per Minute / Day — API 분당/일일 호출 한도.
- **RSS**: Really Simple Syndication — 웹사이트의 업데이트를 구조화된 XML로 배포하는 형식.
- **stdio**: Standard Input/Output — 프로그램이 표준 입출력으로 통신하는 방식(MCP 로컬 서버 기본 통신).
- **JSON-RPC 2.0**: JSON을 쓰는 원격 프로시저 호출 프로토콜(MCP 메시지 포맷).
- **LTS**: Long-Term Support — 장기 지원 버전 (Node.js 설치 시 권장).
- **PowerShell**: Windows의 기본 고급 명령줄 셸. 본 강의의 기본 터미널.
- **winget**: Windows Package Manager — Microsoft 공식 CLI 패키지 관리자. `winget install ...`.
- **venv**: virtual environment — Python의 프로젝트별 격리 공간.
- **SDK**: Software Development Kit — 특정 서비스·플랫폼을 쉽게 쓰게 해주는 공식 라이브러리.
