---
name: template-frontend-build
description: Template.zip의 디자인 언어(블루 그라디언트·다크 섹션·글래스모피즘·Pretendard·Lucide 아이콘)를 유지하면서 교육 사이트(index/curriculum/practices/resources + 슬라이드 뷰어)를 정적 HTML+vanilla JS로 빌드. "사이트 빌드 / 프론트 다시 / 페이지 추가 / 디자인 보정 / 모듈 뷰어 수정 / 슬라이드 뷰어 업데이트" 요청에 트리거.
---

# 템플릿 기반 프론트엔드 빌드 스킬

`frontend-builder` 에이전트용. 디자인 충실도와 런타임 마크다운 렌더를 둘 다 책임진다.

## 왜 이 스킬이 필요한가

교육 사이트는 콘텐츠가 자주 갱신되므로 빌드 스텝 없이 **마크다운 파일 수정만으로 업데이트**되는 구조가 유리하다. 동시에 디자인은 Template.zip의 비주얼 언어를 유지해 "전문적인 교육 플랫폼" 인상을 준다. 이 둘을 정적 HTML + 런타임 fetch + marked/highlight.js CDN 조합으로 해결한다.

## 디자인 토큰 (고정)

```css
:root {
  --blue-600: #2563eb;      /* CTA, 히어로 */
  --blue-700: #1d4ed8;
  --indigo-900: #312e81;    /* 그라디언트 엔드 */
  --navy-950: #0f172a;      /* 다크 섹션 배경 */
  --slate-900: #1e293b;     /* 다크 카드 베이스 */
  --slate-50:  #f8fafc;     /* 라이트 섹션 */
  --radius-xl: 1.25rem;
  --radius-2rem: 2rem;      /* 히어로 카드 */
  --glass-bg: rgba(255,255,255,0.07);
  --glass-border: rgba(255,255,255,0.12);
}
```

폰트는 Pretendard CDN을 `<style>@import`로 로드 (Template과 동일).
아이콘은 Lucide CDN.

## 파일 구조

```
site/
├── index.html          # 랜딩
├── curriculum.html     # 모듈 학습 뷰어
├── practices.html      # 실습 A/B 상세
├── resources.html      # 치트시트·용어집·심화 과제
├── assets/
│   ├── app.js          # 라우팅·마크다운·슬라이드 뷰어
│   ├── styles.css      # 토큰·커스텀 보정
│   ├── curriculum.json # _workspace 결과 복사
│   ├── modules/*.md    # _workspace 결과 복사
│   └── slides/
│       ├── meta.json   # _workspace 결과 복사
│       └── *.png
└── README.md           # 실행: python3 -m http.server 8000
```

## 페이지 구성 가이드

### index.html — 랜딩
섹션 순서 고정:
1. 고정 네비 (투명→스크롤 시 블러)
2. **Hero**: 블루 그라디언트 + 블러 오브 2개 + 2컬럼 (좌 타이포 / 우 글래스 카드 2×2)
3. **Why Now**: 다크 섹션 (`--navy-950`), 3컬럼 카드
4. **커리큘럼**: 라이트 섹션, 모듈 카드 7개 그리드
5. **캡스톤 미리보기**: 블루 섹션, 뉴스 Multi-Agent 다이어그램 (SVG)
6. **실습 A/B + FAQ**: 화이트
7. **푸터**: 다크

### curriculum.html — 학습 뷰어
- 3열 레이아웃(데스크톱): 좌 사이드바(모듈 리스트) / 본문 / 우 TOC+슬라이드 버튼
- 모바일: 사이드바 햄버거 드로어
- 해시 라우팅 `#/modules/{id}`
- 본문: `marked`로 렌더 + Tailwind Typography(또는 수동 .prose)
- 슬라이드 버튼 → 하단 패널 또는 모달 슬라이드 뷰어

### practices.html
- 실습 A 섹션: 단계 다이어그램(5 step) + Skill vs MCP 비교 카드
- 실습 B 섹션: 4-에이전트 카드 + SVG 데이터 흐름 + 리포트 템플릿

### resources.html
- Cursor/Gemini 치트시트
- GLOSSARY.md 렌더
- 공식 문서 링크
- 심화 과제 C1~C3 카드

## JS (`app.js`) 책임

1. 해시 라우팅
2. 모듈 본문 `fetch('assets/modules/{id}.md')` + `marked.parse()` + `highlight.js`
3. 슬라이드 뷰어: `meta.json` 로드 → 좌/우 네비 · 키보드 · 썸네일 그리드
4. `fallback: true` 슬라이드 → `styles.css`의 `.slide-fallback` CSS 카드 렌더
5. 모듈 메뉴 활성 상태 관리

## 슬라이드 뷰어 Fallback 카드

```html
<div class="slide-fallback">
  <span class="badge">Module {n}</span>
  <h2>{제목}</h2>
  <p>{캡션}</p>
</div>
```

CSS로 블루 그라디언트 + 글래스 카드 + 큰 타이포 재현.

## 반응형 규칙

- 375px: 사이드바 드로어, 히어로 1컬럼, 카드 1열
- 768px: 카드 2열, 사이드바 축소
- 1024px+: 3컬럼 레이아웃 완성

## 성능

- CDN CSS/JS는 `defer`
- `marked`, `highlight.js`는 curriculum 페이지에서만 로드
- 이미지는 `loading="lazy"`

## 완료 기준

- [ ] 4개 HTML 파일 + assets 전부 존재
- [ ] `python3 -m http.server 8000`로 열면 콘솔 에러 0
- [ ] 모든 내부 링크 동작
- [ ] 슬라이드 뷰어 키보드 좌/우/ESC 동작
- [ ] 모바일 375px 레이아웃 깨짐 없음
- [ ] 디자인 토큰 6개(블루·인디고·네이비·슬레이트·글래스·rounded-[2rem]) 모두 사용 확인
