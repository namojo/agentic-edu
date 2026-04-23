# SDS Agentic AI 1회차 — 교육 사이트 (`docs/`)

정적 HTML + vanilla JS로 구성된 사내 교육 사이트. 빌드 스텝이 없으며 마크다운 파일을 고치면 바로 반영됩니다. 8개 모듈(00 환경 설정 ~ 07 캡스톤), 총 4.5시간.

## GitHub Pages 배포 (권장)

이 디렉토리(`docs/`)는 **GitHub Pages의 공식 `main` 브랜치 `/docs` 폴더 publish**에 맞춰 구성됐습니다.

### 설정 단계

1. GitHub 저장소 → **Settings**
2. 왼쪽 메뉴 **Pages** 선택
3. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` · Folder: `/docs`
   - **Save** 클릭
4. 1~2분 후 상단에 `https://<user>.github.io/<repo>/` URL 노출

### 배포 조건 체크

- `docs/.nojekyll` (빈 파일) — Jekyll 빌드 스킵 강제 (필수)
- `docs/404.html` — SPA-ish 해시 라우팅 진입점 보호 (index.html 복사본)
- 모든 asset/페이지 링크는 **상대 경로** (`assets/...`, `index.html`, `curriculum.html`) — 서브폴더 publish 호환
- `<base>` 태그 **사용 금지** — publish 서브경로와 충돌

### 커스텀 도메인 (선택)

`docs/CNAME` 파일에 도메인 한 줄만 넣으면 Pages가 자동 인식. 이 경우 HTTPS 활성은 Pages 설정에서 켜세요.

## 로컬 프리뷰

```bash
# 저장소 루트에서 (권장 — URL이 /docs/ 로 붙어 GH Pages와 동일한 경로 구조)
cd /Users/andy/Work/vibe-app
python3 -m http.server 8000
# → 브라우저에서 http://localhost:8000/docs/ 열기
```

또는 docs 디렉토리 안에서 직접:

```bash
cd /Users/andy/Work/vibe-app/docs
python3 -m http.server 8000
# → http://localhost:8000/
```

윈도우(PowerShell):

```powershell
cd C:\path\to\vibe-app
python -m http.server 8000
# → http://localhost:8000/docs/
```

## 구조

```
docs/
├── index.html          # 랜딩 (Hero · Why Now · 8 모듈 그리드 · 캡스톤 · FAQ)
├── curriculum.html     # 모듈 뷰어 (사이드바 + 마크다운 + TOC + 슬라이드 + Mermaid)
├── practices.html      # 실습 A / 캡스톤 B(Mermaid 아키텍처) / 심화 C1~C3
├── resources.html      # Cursor 치트시트(Windows 기본) · MCP 카탈로그 · Gemini 한도 · 용어집
├── 404.html            # index.html 복사본 (GH Pages SPA 진입 보호)
├── .nojekyll           # Jekyll 스킵
└── assets/
    ├── app.js          # 해시 라우팅·Mermaid 렌더·슬라이드 뷰어·스크롤 리셋
    ├── styles.css      # 디자인 토큰·prose·슬라이드 fallback·Mermaid 카드
    ├── curriculum.json # _workspace/01_curriculum.json 복사본
    ├── glossary.md     # _workspace/GLOSSARY.md 복사본
    ├── modules/*.md    # 8개 모듈 본문 (00~07)
    └── slides/
        ├── meta.json   # 슬라이드 메타 (slide-designer가 덮어씀)
        └── *.png       # slide-designer 산출 시 여기에 채워짐
```

## 슬라이드

`assets/slides/meta.json`이 비어 있거나 이미지가 없으면 뷰어는 CSS fallback 카드(블루 그라디언트 + 글래스 + 제목/캡션)를 모듈별로 1장씩 자동 생성합니다. 이미지가 로드 실패(onerror)해도 자동 fallback.

### 슬라이드 단축키

- `←` / `→`: 이전 / 다음 슬라이드
- `T`: 썸네일 그리드 토글
- `A`: "전체 슬라이드 보기"(모든 모듈) ↔ "현재 모듈" 전환
- `Esc`: 닫기

## Mermaid 다이어그램

- 모듈 마크다운 안의 <code>```mermaid ... ```</code> 블록은 자동으로 렌더됩니다.
- `curriculum.html`과 `practices.html`에 Mermaid v11 CDN이 추가돼 있습니다.
- 테마는 사이트 다크 디자인에 맞춰 커스터마이즈 (blue #2563eb / indigo #312e81 / navy #0f172a).
- 슬라이드 뷰어는 이미지 전용이라 Mermaid 렌더 대상에서 제외됩니다(충돌 없음).

## 콘텐츠 수정 흐름

- 모듈 본문: `assets/modules/<id>.md` 편집 → 새로고침하면 바로 반영 (캐시 리셋하려면 하드 리로드)
- 용어집: `assets/glossary.md` 편집 → resources.html 에 반영
- 커리큘럼 JSON: `_workspace/01_curriculum.json` → 수동 복사 `cp _workspace/01_curriculum.json docs/assets/curriculum.json`
- 디자인 토큰: `assets/styles.css`의 `:root` CSS 변수만 수정

## 디자인 토큰 (고정)

- Primary blue: `#2563eb` · Indigo-900: `#312e81` · Navy-950: `#0f172a` · Slate-900: `#1e293b`
- 폰트: Pretendard (CDN)
- 아이콘: Lucide (CDN)
- 카드 모서리: `rounded-[2rem]` (Hero/실습 대형), `rounded-2xl` (중형)

## 외부 의존 CDN

- Tailwind (`cdn.tailwindcss.com`) — 스타일 빠른 적용
- Pretendard CSS (orioncactus)
- Lucide (`unpkg.com/lucide@latest`)
- marked (`cdn.jsdelivr.net/npm/marked`)
- highlight.js (`cdn.jsdelivr.net/gh/highlightjs/cdn-release`) — curriculum.html
- Mermaid 11 (`cdn.jsdelivr.net/npm/mermaid@11`) — curriculum.html · practices.html

## 접근성·반응형 요약

- 375px 이하에서 사이드바는 드로어
- 모든 이미지에 `alt`, 대화형 요소에 `aria-label`
- 키보드 포커스 링은 브라우저 기본 유지

## 라이선스 / 문의

사내 교육용. 문의: namho.cho@samsung.com
