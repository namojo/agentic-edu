# Vibe App — 삼성SDS Agentic AI 교육 사이트

## 하네스: 삼성SDS Agentic AI 교육 사이트

**목표:** 비전공자 포함 삼성SDS 직원을 위한 "Agentic AI 개발 1회차" 교육 사이트(Cursor + Gemini 기반 커리큘럼·실습·슬라이드)를 빌드/유지한다.

**트리거:** 교육 사이트, 커리큘럼, 모듈 본문, 실습 시나리오, 슬라이드, 디자인, 뉴스 멀티에이전트 캡스톤 관련 작업 요청 시 `edu-site-orchestrator` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**변경 이력:**

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-23 | 초기 하네스 구성 (에이전트 6명 + 스킬 6개 + 오케스트레이터) | 전체 | 신규 구축 |
| 2026-04-23 | tech-researcher 에이전트 추가 | agents/tech-researcher.md | Cursor/MCP 최신 정보 반영 요구 |
| 2026-04-23 | 커리큘럼에 실습 A(파일 관리 MCP+Skill) · 캡스톤 B(한/미 뉴스 멀티에이전트) 명시 | curriculum-architect · content-writer | 구체적 실습 시나리오 요청 |
| 2026-04-23 | 보너스 실습 A1(메일 요약)·A2(회의록)·A3(CSV) + 심화 과제 C1~C3 추가 | content-writer · curriculum-design 스킬 | 추가 실습 사례 확장 요청 |
| 2026-04-23 | Plan C 확정 (Cursor Free 내장 LLM + 별도 터미널 Gemini) | content-writer 전체 본문 | Cursor Free BYOK 제약 발견 |
| 2026-04-23 | 슬라이드 12장 생성 + 사이트 초기 빌드 + QA PASS | site/ 전체 | 초기 릴리스 |
| 2026-04-23 | M1·M2 수정 (curriculum.json ID 통일, powershell 하이라이터 추가) | curriculum.json, curriculum.html | QA Major 후속 |
| 2026-04-23 | v2 대규모 개정 시작: USER_NOTES v2 작성 | _workspace/USER_NOTES.md | 8개 요구사항 + Mermaid |
| 2026-04-23 | site/ → docs/ 리네임 + .nojekyll + 404.html | docs/ 전체 | GitHub Pages `/docs` 공식 지원 경로 |
| 2026-04-23 | v2 재조사 (Cursor 4 모드, Windows, GH Pages, google-genai) | 00_tech_research.md §8 | 최신 정보 반영 |
| 2026-04-23 | 모듈 00-setup 신설 + 기존 7모듈 전면 재작성 | 02_modules/*.md, GLOSSARY.md | Windows 중심·4모드·영문폴더·Mermaid·수동/AI 양쪽 |
| 2026-04-23 | 사이트 v2 갱신 (Mermaid CDN, 상대경로, scroll reset, 모듈 00 네비) | docs/*.html, assets/app.js, styles.css | GH Pages + UX 개선 |
| 2026-04-23 | 슬라이드 v2 55장 생성 (실습 내용·코드·다이어그램·체크리스트) | docs/assets/slides/ | 요구 #2 반영 |
| 2026-04-23 | v2 QA (9개 요구사항 PASS, Critical 0, Major 1 수정 완료) | _workspace/04_qa_report_v2.md | 최종 검수 |
| 2026-04-23 | M1 후속: curriculum.json의 Composer 6건 → Chat/Ask/Agent/Plan | 01_curriculum.json, docs/assets/curriculum.json | 용어 정합성 |
