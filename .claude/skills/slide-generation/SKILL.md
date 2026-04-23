---
name: slide-generation
description: Gemini 이미지 생성으로 교육 슬라이드(16:9, 블루/인디고 그라디언트·글래스모피즘·Pretendard 헤드라인)를 만드는 스킬. 모듈별 대표 비주얼 + 핵심 개념 슬라이드를 일괄 생성하고 메타데이터 JSON을 갱신. "슬라이드 만들기 / 슬라이드 다시 / 특정 모듈 슬라이드 재생성 / 슬라이드 프롬프트 수정" 요청에 트리거.
---

# 슬라이드 생성 스킬

`slide-designer` 에이전트가 사용. 실제 이미지 생성은 `gemini-3-pro-imagegen` 스킬을 위임 호출한다.

## 왜 이 스킬이 필요한가

교육 슬라이드는 일관된 디자인 언어와 정확한 타이포 배치, 16:9 해상도, 교안 색상 토큰을 따라야 한다. 개별 호출마다 스타일이 흔들리면 사이트가 디자인적으로 산만해진다. 이 스킬은 **프롬프트 템플릿**을 고정해 일관성을 보장한다.

## 프롬프트 템플릿 (필수 사용)

모든 슬라이드 생성 시 아래 템플릿의 `{placeholder}`만 채워 넣는다:

```
Editorial 16:9 slide visual for a tech education course.
Subject: {주제 키워드 영문}
Korean headline text embedded: "{한글 헤드라인 짧게}"
English subtitle text embedded: "{영문 부제}"
Style: modern Korean tech editorial, deep indigo (#312e81) to electric blue (#2563eb) gradient background, subtle dark navy (#0f172a) accent zones, glassmorphism cards with soft blur and white 10% borders, sharp minimal sans-serif typography (Pretendard/Inter feel), generous negative space, one focal illustrative metaphor on right side.
Avoid: photorealistic humans, stock imagery, corporate logos, cluttered ui mockups, watermark, noise.
Aspect: 16:9.
Resolution: high, print-ready.
```

헤드라인은 8자 이내, 부제는 영문 6단어 이내로 유지한다. 이미지 안에 텍스트가 많아질수록 Gemini의 타이포 정확성이 떨어지기 때문.

## 슬라이드 계획

커리큘럼 모듈 7개 × 평균 1.5장 = **총 10~14장**을 목표로. 모듈별 배정:

| 모듈 | 슬라이드 | 주제 |
|------|---------|------|
| 01 | 2장 | 커버, Cursor+Gemini 환경 |
| 02 | 2장 | Cursor 기능 투어 커버, Agent 모드 개념 |
| 03 | 1장 | Skill = 업무 매뉴얼 비유 |
| 04 | 2장 | MCP = USB-C 비유, 파일 MCP 동작 |
| 05 | 1장 | 단일 Agent = 전담 비서 |
| 06 | 2장 | Multi-Agent 팀 구조, 협업 패턴 |
| 07 | 2~4장 | 캡스톤 커버, 4-에이전트 다이어그램, 뉴스 리포트, 심화 아이디어 |

## 실행 순서

1. `_workspace/01_curriculum.json`의 `keyVisualPrompt` 각각 + 모듈 본문의 `## 슬라이드 요약` 포인트 로드
2. 슬라이드마다 위 템플릿을 채워 프롬프트 생성
3. `gemini-3-pro-imagegen` 스킬 호출 — 모델은 `gemini-3.1-flash-image-preview`(Nano Banana 2) 또는 `gemini-3-pro-image-preview`(Nano Banana)
4. 출력 이미지를 `site/assets/slides/{module-id}-{slide-no}.png`로 저장
5. `_workspace/03_slides.json` 엔트리 생성/갱신 (`agents/slide-designer.md`의 스키마 준수)

## 실패 처리

- 1회 재시도 (프롬프트 단순화 버전)
- 재실패 시 해당 엔트리 `fallback: true` + `imagePath`를 비워두고 CSS 대체 카드 지시를 메타에 기록
- 실패한 프롬프트는 `_workspace/slides_failed.log`에 남김

## 재호출 시 동작

- "모듈 N 슬라이드 다시" → 해당 `moduleId` 엔트리만 재생성, 기존 파일은 `_workspace/slides_prev/`로 백업
- "슬라이드 전체 재생성" → `_workspace/slides_prev_{ts}/`로 백업 후 전량 재생성
- "프롬프트 스타일 변경" → 위 템플릿 수정 후 전량 재생성

## 완료 기준

- [ ] `_workspace/03_slides.json` 엔트리 10~14개
- [ ] 각 엔트리 `imagePath` 파일 실제 존재 또는 `fallback: true`
- [ ] 생성된 이미지 16:9 비율
- [ ] 프롬프트 원문 저장 (재현성 확보)
