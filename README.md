# Agentic AI 개발 교육 사이트 (1회차)

삼성SDS 비전공자 직원을 위한 "Agentic AI 개발 1회차" 교육 사이트입니다. Cursor 에디터 + Gemini 무료 API 키 기반으로 Skill, MCP, Agent, Multi-Agent, Workflow 자동화를 다룹니다.

## 구성

- **8개 모듈** (환경 설정 → 바이브코딩 → Cursor 투어 → Skill → MCP → 단일 Agent → Multi-Agent → 캡스톤)
- **실습 A**: 파일 관리 Skill + MCP 서버 (`file-organizer`, `file-manager-mcp`)
- **캡스톤 B**: 한·미 뉴스 멀티에이전트 (`news-multiagent`) — kr-news-agent · us-news-agent · fact-checker · orchestrator
- **55장 실습 슬라이드** (개념 비유·코드 캡처·아키텍처·단계 가이드·체크리스트)
- **Mermaid 다이어그램 17개** (flowchart · sequenceDiagram)

## 보기

### 온라인 (GitHub Pages)
이 저장소의 GitHub Pages 배포 URL에서 바로 확인할 수 있습니다.

### 로컬
```powershell
python -m http.server 8000
# → http://localhost:8000/docs/
```

## 폴더

```
docs/            # 배포되는 정적 사이트 (GitHub Pages source: /docs)
├── index.html · curriculum.html · practices.html · resources.html
├── 404.html · .nojekyll · README.md
└── assets/ (app.js · styles.css · curriculum.json · modules/ · slides/)
.claude/         # 하네스 (에이전트/스킬 정의)
CLAUDE.md        # 하네스 포인터 + 변경 이력
netlify.toml     # Netlify 배포 옵션 설정 (미사용)
```

## 환경

- 대상 환경: Windows 10/11 (macOS는 보조)
- Cursor 4 모드: Chat / Ask / Agent / Plan
- Gemini API: Python `google-genai` SDK로 터미널에서 호출 (Cursor Free 플랜 호환)

## 라이선스

내부 교육용. 외부 배포 전 확인 필요.
