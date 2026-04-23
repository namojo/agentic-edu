---
name: edu-content-review
description: 교육 사이트의 콘텐츠 정확성·디자인 충실도·UX 동작·접근성을 경계면 교차 검증으로 점검하는 QA 스킬. Playwright로 브라우저 렌더까지 확인. "사이트 QA / 리뷰 / 검수 / 점검 / 품질 점검 / 최종 확인" 요청에 트리거.
---

# 교육 콘텐츠 QA 스킬

`qa-reviewer` 에이전트용.

## 왜 이 스킬이 필요한가

존재 확인("파일이 있다")은 QA가 아니다. 진짜 버그는 **경계면**에서 발생한다 — 커리큘럼 JSON이 가진 모듈 ID와 실제 모듈 파일 이름이 다르거나, slides.json이 가리키는 이미지 경로가 사이트에 배치된 위치와 다를 때다. 이 스킬은 경계면 교차 검증을 체계화한다.

## 검증 4-계층

### 계층 1 — 구조 정합성 (파일 간 ID 비교)

- `_workspace/01_curriculum.json`.modules[*].id  ↔  `_workspace/02_modules/{id}.md`의 frontmatter id  ↔  `site/assets/modules/{id}.md` 파일명
- `_workspace/03_slides.json`.slides[*].moduleId  ⊆  curriculum modules[*].id
- `_workspace/03_slides.json`.slides[*].imagePath  ↔  `site/assets/slides/` 실제 파일
- `assets/curriculum.json` ↔ `_workspace/01_curriculum.json` (복사본 동기 여부)

모든 비교에서 누락·여분·ID 오타를 Critical로 분류.

### 계층 2 — 콘텐츠 정확성

- `00_tech_research.md`의 **사실 목록**과 모듈 본문의 **사실 주장** 대조
- 의심 키워드: "create-skill", "create-subagent", "mcp.json 위치", "Gemini 무료 한도", "Cursor Agent 모드"
- 구체적 URL·버전 번호·파일 경로는 출처 일치 확인

틀린 사실은 Major 이상. 출처 없는 단정은 Minor.

### 계층 3 — UX 및 기능 (Playwright 실행)

`webapp-testing` 스킬로 로컬 서버(`python3 -m http.server 8000`)를 띄우고:

- [ ] index 히어로 CTA 클릭 → curriculum 이동
- [ ] curriculum 좌측 메뉴 클릭 → 본문 렌더
- [ ] 마크다운 코드 블록 하이라이팅 작동
- [ ] 슬라이드 뷰어: 좌 화살표 / 우 화살표 / 숫자 표시 / ESC 닫힘
- [ ] practices, resources 페이지 링크 동작
- [ ] 모바일 뷰포트 375×667 스크린샷 저장 (`_workspace/qa_screens/mobile.png`)
- [ ] 콘솔 에러 0

### 계층 4 — 디자인 충실도

- Template.zip 상단 네비 스크린샷 vs site/index.html 상단 네비 스크린샷 비교 저장
- 블루 #2563eb / 인디고 #312e81 / 네이비 #0f172a 존재 여부 CSS 인스펙션
- Pretendard 폰트 로드 확인 (network tab)
- 글래스모피즘 카드 `backdrop-filter: blur` 존재 확인

## 리포트 템플릿

`_workspace/04_qa_report.md`로 저장. `agents/qa-reviewer.md`의 "출력" 스키마 준수.

## 점진적 QA

각 모듈 완성 직후 해당 모듈만 1~3계층 빠른 점검(5분 내). 전체 완성 후 4계층까지 풀 스캔 1회.

## 재호출 시 동작

- "QA 다시" → 4계층 풀 스캔. 이전 리포트는 `_workspace/qa_prev/`로 이동.
- "N번 이슈 다시 확인" → 해당 이슈 항목만 재검증, 리포트의 해당 엔트리만 업데이트.

## 완료 기준

- [ ] `04_qa_report.md` 생성
- [ ] Critical 이슈가 있으면 담당자에게 SendMessage로 즉시 알림
- [ ] Playwright 스크린샷 최소 2개(데스크톱·모바일)
- [ ] 4계층 모두 체크됨 (미수행 이유 기록 가능)
