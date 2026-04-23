---
id: 00-setup
title: 환경 설정하기 (Windows 기준)
order: 0
duration: 30~40분
difficulty: 입문
metaphor: 공구함 채우기 — 오늘 실습에 필요한 도구 8가지를 미리 책상에 올리는 준비 단계
---

# 00. 환경 설정하기 (Windows 기준)

> 수업이 시작되기 전, 각자 노트북에 "오늘의 공구함"을 세팅합니다. 여기서 8가지 도구(Node.js, Git, Cursor, Gemini 키, Python 등)를 모두 갖춰 두면, 이후 모듈 01~07에서는 "왜 안 돼요?"로 시간을 낭비하지 않습니다. 30~40분만 투자하세요.

## 이 모듈을 마치면

- Windows PC에서 Node.js · Git · Cursor · Python 3.12가 정상 설치된 상태가 됩니다.
- Google AI Studio에서 발급한 Gemini API 키가 환경변수 `GEMINI_API_KEY`로 영구 등록됩니다.
- 가상환경(venv) 위에서 `google-genai` SDK가 설치되고, 첫 Gemini 호출 스크립트가 성공합니다.
- 마지막 체크리스트 8개 항목이 모두 `✅`이면 모듈 01로 갈 준비 끝입니다.

## 오늘의 공구함 (한눈에)

아래 8개 도구를 차례로 설치·확인합니다. 설치 순서가 중요합니다. 위에서 아래로 읽어 내려가세요.

1. **Node.js LTS** — MCP 서버(모듈 04)를 실행할 런타임
2. **Git for Windows** (선택) — 설정·코드를 GitHub에 올릴 때 필요
3. **Cursor 에디터** — 오늘 수업의 메인 작업 창
4. **Google AI Studio 계정 + Gemini API 키**
5. **Windows 환경변수 `GEMINI_API_KEY`** 영구 등록
6. **Python 3.12** — 터미널에서 Gemini를 직접 호출할 때
7. **가상환경(venv) + `google-genai` SDK**
8. **Hello Gemini 스크립트** — 첫 성공 경험

시작합시다.

## Step 1. Node.js LTS 설치

MCP 서버(모듈 04)는 대부분 Node.js 위에서 돕니다. **LTS(Long-Term Support)** 버전을 쓰면 오늘 실습이 안전합니다. 2026-04 현재 LTS는 20.x 이상입니다.

### 방법 A: winget (권장)

- **어디서**: Windows **PowerShell** (시작 메뉴 → "PowerShell" 검색)
- **무엇을 입력**:

```powershell
winget install OpenJS.NodeJS.LTS
```

- **무엇을 기대**: "Successfully installed" 메시지. 진행 막대가 100%까지 가면 완료.

### 방법 B: 공식 설치 파일

- `https://nodejs.org` 접속 → "LTS" 큰 버튼 → `.msi` 다운로드 → 더블클릭 → "Next" 반복.
- 설치 마법사 중간에 **"Add to PATH"** 체크박스가 있으면 반드시 켜두세요.

### 설치 확인

새 PowerShell 창을 하나 **더** 열어 입력:

```powershell
node -v
npm -v
```

- **무엇을 기대**: `v20.x.x`, `10.x.x` 같은 버전 문자열 두 줄. 둘 다 나오면 OK.

💡 "두 개 다 아무것도 안 뜨고 '인식할 수 없는 명령'이 뜬다"면 **새 PowerShell 창**을 한 번 더 열어 다시 시도하세요. 설치 직후의 기존 창은 예전 PATH를 기억합니다.

<details><summary>macOS에서는</summary>

터미널(Terminal.app)에서 Homebrew로 설치합니다.

```bash
brew install node
node -v
npm -v
```

</details>

## Step 2. Git for Windows 설치 (선택, 권장)

Git은 오늘 실습 자체에는 꼭 필요하지 않지만, **나중에 설정을 GitHub에 올리거나 팀과 공유**할 때 반드시 필요합니다. 지금 같이 설치해두면 편합니다.

### winget으로 설치

```powershell
winget install Git.Git
```

### 확인

```powershell
git --version
```

- **무엇을 기대**: `git version 2.x.x` 형태의 한 줄.

🎯 **첫 실행 시 사용자 정보 설정** (한 번만):

```powershell
git config --global user.name "홍길동"
git config --global user.email "myname@example.com"
```

<details><summary>macOS에서는</summary>

macOS는 기본적으로 Xcode Command Line Tools와 함께 Git이 들어 있습니다. 없으면 `brew install git`.

</details>

## Step 3. Cursor 다운로드·설치

Cursor는 오늘 수업의 **메인 작업 창**입니다. VS Code와 비슷한 에디터에 AI가 옆자리에 붙어 있다고 보면 됩니다.

### 다운로드

- **어디서**: 웹 브라우저
- **무엇을**: `https://cursor.com/download` 접속
- **무엇을 기대**: 페이지가 자동으로 Windows를 감지해 `.exe` 다운로드 버튼을 보여줍니다.

### Installer 선택 — User Setup (권장)

Cursor는 두 종류의 설치본을 제공합니다.

| 종류 | 설치 경로 | 권한 | 누구에게 |
|------|----------|------|----------|
| **User Setup** (권장) | `%LOCALAPPDATA%\Programs\cursor\` | 관리자 불필요 | 개인 PC, 사내 관리형 PC 모두 OK |
| System Setup | Program Files | 관리자 필요 | 공용 워크스테이션 |

다운로드 버튼 근처 작은 링크로 "User Setup"을 선택할 수 있습니다. 기본값은 대부분 User Setup입니다.

### 설치 후 첫 실행 (Onboarding)

- 설치 마법사는 "Next → Next → Install"만 누르면 끝납니다.
- 첫 실행 시 다음 질문들이 순서대로 뜹니다.
  - **Theme (테마)**: Dark 권장. 나중에 언제든 변경 가능.
  - **Keybindings**: VS Code 쓰던 분은 "VS Code" 선택.
  - **Sign in**: "Continue without signing in"으로 건너뛰어도 OK. 동기화를 원하면 Google 계정 로그인.
  - **Codebase indexing**: "Enable" 권장. 현재 폴더의 코드 검색이 빨라집니다.

### 설치 확인

시작 메뉴에서 "Cursor"를 검색 → 실행 → 빈 창이 뜨면 OK.

⚠️ **Windows Defender / SmartScreen 경고**가 뜰 수 있습니다. "추가 정보 → 실행"을 클릭. Cursor는 서명된 installer라 정상입니다. 조직 관리형 PC에서 막히면 IT팀에 신뢰 앱 등록을 요청하세요.

<details><summary>macOS에서는</summary>

`https://cursor.com/download`에서 `.dmg` 다운로드 → 열고 Cursor 아이콘을 Applications 폴더로 드래그.

</details>

## Step 4. Google AI Studio에서 Gemini API 키 발급

Cursor와 **별개로**, Python 터미널에서 직접 Gemini를 호출할 때 쓸 API 키를 발급합니다.

### 클릭 시퀀스 (2026-04 기준 UI)

1. 브라우저에서 `https://aistudio.google.com` 접속 → Google 계정 로그인.
2. **첫 방문 시**: Google Generative AI 이용약관(ToS) 동의 + 지역 확인 다이얼로그. 승인 시 기본 Google Cloud Project와 API Key가 자동 생성되는 경우가 있습니다.
3. 좌측(혹은 상단 네비)의 **"Get API key"** 버튼 클릭. 직접 URL은 `https://aistudio.google.com/apikey`.
4. **"Create API key"** 버튼 클릭.
   - 옵션 1: "Create API key in new project" (초보자 권장, 자동 프로젝트 생성)
   - 옵션 2: "Create API key in existing project" (기존 GCP 프로젝트 지정)
5. 생성된 키가 화면에 표시됩니다. 형태: `AIzaSy...`로 시작하는 긴 문자열.
6. **"Copy"** 버튼으로 클립보드에 복사.

### 키 보관 원칙 (필수)

- 메모장·Slack DM·이메일·GitHub public repo에 **절대 붙여넣지 마세요.** Google의 자동 탐지기가 수 시간 내에 감지해 키를 비활성화합니다.
- 지금 잠깐 메모장에 임시 보관해도 되지만, **Step 5에서 환경변수로 이동**하면 바로 지우세요.
- "Gemini for Google Cloud"나 "Vertex AI" 페이지와 혼동하지 마세요. 교육용 무료 티어는 **AI Studio 경로**만 씁니다.

💡 키는 언제든 같은 페이지에서 재열람·재발급·삭제 가능합니다. 실수로 공개됐다 싶으면 즉시 삭제 후 새로 만드세요.

## Step 5. Windows 환경변수 `GEMINI_API_KEY` 영구 등록

키를 **환경변수**에 저장하면, 모든 터미널·스크립트에서 동일하게 꺼내 쓸 수 있고 코드에 하드코딩하지 않아도 됩니다. 두 가지 방법이 있습니다.

### 방법 A: PowerShell (권장, 한 줄)

- **어디서**: 새 PowerShell 창
- **무엇을 입력** (키 자리에 실제 복사한 값 붙여넣기):

```powershell
[Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'AIzaSy...여기에실제키...', 'User')
```

- **무엇을 기대**: 아무 출력 없이 프롬프트가 돌아옵니다. 내부적으로는 Windows "사용자 변수"에 등록됐습니다.

### 방법 B: GUI (시스템 속성)

- 시작 메뉴에서 "환경 변수" 또는 `sysdm.cpl` 입력 → "시스템 속성" → **고급** 탭 → **환경 변수(N)...** 버튼.
- 상단 **"사용자 변수"** 섹션에서 **새로 만들기...** 클릭.
- 변수 이름: `GEMINI_API_KEY`, 변수 값: `AIzaSy...`(복사한 키). 확인.
- 열려 있는 창들을 모두 확인으로 닫기.

### 확인

반드시 **새 PowerShell 창**을 하나 열어:

```powershell
echo $env:GEMINI_API_KEY
```

- **무엇을 기대**: `AIzaSy...` 로 시작하는 키가 한 줄 찍힘.

⚠️ **이미 열려 있는 PowerShell / Cursor 창은 환경변수를 캐시해뒀습니다.** 이들은 키를 못 봅니다. **반드시 창을 새로 열어야** 합니다. Cursor도 실행 중이면 종료 → 재실행.

<details><summary>macOS에서는</summary>

`~/.zshrc` 끝에 한 줄 추가 후 source:

```bash
echo 'export GEMINI_API_KEY="AIzaSy..."' >> ~/.zshrc
source ~/.zshrc
echo $GEMINI_API_KEY
```

</details>

## Step 6. Python 3.12 설치 + 가상환경

Gemini 공식 SDK는 Python 3.10 이상을 요구합니다. 안정적인 **3.12**를 권장합니다.

### Python 설치

```powershell
winget install Python.Python.3.12
```

### 확인

새 PowerShell 창에서:

```powershell
python --version
```

- **무엇을 기대**: `Python 3.12.x`. winget으로 설치하면 PATH가 자동 등록됩니다. "python이 뭔지 모르겠다"면 창을 한 번 더 새로 열어보세요.

💡 **Windows 10/11 기본 "Python" 바로가기**는 MS Store로 연결되는 경우가 있습니다. `python`이 안 동작하면 `py -3.12 --version`으로 시도해보세요. `py` 런처는 Python 공식 Windows 설치본이 기본 제공합니다.

### 프로젝트 폴더 만들기

오늘 모든 실습 파일을 담을 폴더를 하나 정해둡니다. 예: `C:\Users\<사용자>\vibe-1st`.

```powershell
cd $env:USERPROFILE
mkdir vibe-1st
cd vibe-1st
```

### 가상환경(venv) 생성·활성화

가상환경은 "이 프로젝트 전용 Python 작업실"입니다. 전역 Python을 오염시키지 않고, 설치한 패키지를 폴더 안에 가둬둡니다.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

- **무엇을 기대**: 프롬프트 앞쪽에 `(.venv)` 표시. 이게 떠 있으면 "가상환경 활성화 상태".

⚠️ **실행 정책 에러**가 나올 수 있습니다. 메시지 예시:

```
.venv\Scripts\Activate.ps1 : ... 스크립트 실행이 비활성화되어...
```

한 번만, 사용자 스코프로 완화하세요.

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

"Y" 입력 후 엔터. 이제 `.\.venv\Scripts\Activate.ps1`이 동작합니다.

<details><summary>macOS에서는</summary>

```bash
cd ~
mkdir vibe-1st && cd vibe-1st
python3 -m venv .venv
source .venv/bin/activate
```

</details>

## Step 7. `google-genai` SDK 설치

가상환경이 활성화된 상태에서:

```powershell
pip install --upgrade pip
pip install -U google-genai
```

- **무엇을 기대**: `Successfully installed google-genai-x.y.z` 같은 메시지. 에러 없이 종료되면 OK.

⚠️ **구 패키지 `google-generativeai`**와 이름이 다릅니다. `google-genai`가 신 공식 SDK입니다. 헷갈리지 마세요.

💡 **사내 프록시** 환경이면 `pip install` 시 `--proxy http://프록시주소:포트`를 붙이거나, 환경변수 `HTTPS_PROXY`를 설정하세요. 사내 PKI 인증서가 필요하면 `pip config set global.cert <cert경로>`.

## Step 8. Hello Gemini 스크립트 (첫 성공 경험)

드디어 첫 Gemini 호출입니다. Cursor 없이도, 내 터미널에서 직접 LLM과 대화하는 감각을 체험합니다.

### 파일 만들기

`vibe-1st` 폴더 안에 `hello.py` 파일을 만들고 아래 내용을 붙여넣으세요. Cursor로 열어서 편집해도 좋고, PowerShell에서 `notepad hello.py`로 편집해도 됩니다.

```python
# hello.py
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="한 문장으로 자기 소개를 해줘. 존댓말로.",
)
print(response.text)
```

### 실행

```powershell
python hello.py
```

- **무엇을 기대**: 몇 초 안에 한국어 한 문장이 터미널에 찍힙니다. 예: `"안녕하세요, 저는 Gemini라는 AI 언어 모델입니다."`

축하합니다 — 방금 **직접 LLM API를 코드로 호출**했습니다. 이 경험 하나가 오늘 모듈 05(단일 Agent) 보너스와 실습 B 모듈 07에서 다시 빛을 발합니다.

### 실패했다면?

| 에러 메시지 | 원인 | 해결 |
|-------------|------|------|
| `KeyError: 'GEMINI_API_KEY'` | 환경변수가 현재 창에 없음 | PowerShell을 새로 열어 `echo $env:GEMINI_API_KEY` 확인. 없으면 Step 5 다시. |
| `ModuleNotFoundError: No module named 'google'` | venv가 활성화 안 됐거나 설치 안 됨 | `(.venv)` 표시 확인 → `pip install google-genai` 재실행 |
| `google.genai.errors.ClientError: 429 RESOURCE_EXHAUSTED` | 무료 RPM 초과 | 30~60초 기다렸다가 재실행, 또는 `model="gemini-2.5-flash-lite"`로 변경 |
| `google.genai.errors.ClientError: 400 API_KEY_INVALID` | 키가 잘못됨 | AI Studio 페이지에서 키 재복사 → Step 5 재등록 |
| SSL·프록시 에러 | 사내 방화벽 | `HTTPS_PROXY` 환경변수 설정 또는 사내 IT 문의 |

## 무료 티어 한도 (참고)

실습 중 많이 호출하면 금방 한도에 걸립니다. **2026-04 기준 확인된 값**(공식 안내는 AI Studio 대시보드 참조):

| 모델 | RPM (분당) | RPD (일일) | 메모 |
|------|-----------|------------|------|
| `gemini-2.5-flash-lite` | 15 | 1,000 | 경량·대량. 수업에서 가장 여유 있음 |
| `gemini-2.5-flash` | 10 | 250 | 범용 기본. 오늘 수업 기본값 |
| `gemini-2.5-pro` | 5 | 100 | 가장 똑똑, 가장 빠듯 |

💡 교실 20명이 동시에 실습하면 공유 아님에도 각자 한도 충분. 하지만 개인이 "재미로" 반복 실행하면 몇 분 안에 다 씁니다. 모듈 07 실습 B을 위해 **아껴 쓰세요**.

## 환경 점검 체크리스트 (8개 모두 `✅`이면 졸업)

모듈 01로 가기 전에 아래 8개를 전부 체크합니다. 하나라도 `❌`이면 다시 위로 돌아가 해당 Step부터 점검하세요.

- [ ] (1) 새 PowerShell 창에서 `node -v`가 `v20.x` 이상 출력된다
- [ ] (2) `git --version`이 `git version 2.x` 출력한다 (선택, 미설치면 나중에)
- [ ] (3) Cursor가 실행되고 빈 창이 뜬다
- [ ] (4) Google AI Studio에서 API 키를 복사해 안전한 곳에 둔다
- [ ] (5) 새 PowerShell 창에서 `echo $env:GEMINI_API_KEY`가 `AIzaSy...` 출력한다
- [ ] (6) `python --version`이 `Python 3.12.x` 출력한다
- [ ] (7) venv 활성화 후 `(.venv)` 프롬프트가 보이고 `pip list`에 `google-genai` 포함
- [ ] (8) `python hello.py` 실행 시 한국어 한 문장이 터미널에 찍힌다

8개 전부 OK면, 축하합니다. **오늘의 공구함 세팅 완료.** 모듈 01로 이동하세요.

## 자주 막히는 지점

- **증상**: `winget`이 인식되지 않는다 ("'winget'은(는) 내부 또는 외부 명령이 아닙니다").
  **해결**: Windows 10 1809 이전은 winget 미지원. Microsoft Store에서 "App Installer"를 업데이트하거나, 각 도구의 공식 `.msi`/`.exe`로 설치하세요.

- **증상**: Cursor 설치 시 "Windows에서 PC를 보호했습니다" 경고.
  **해결**: "추가 정보 → 실행" 클릭. Cursor는 서명된 installer이며 정상입니다. 조직 관리 PC는 IT에 신뢰 앱 등록 요청.

- **증상**: `python` 명령이 MS Store 창을 띄운다.
  **해결**: Windows의 가짜 python 바로가기 때문. `py -3.12 --version` 또는 설치 후 `python --version`을 **새 PowerShell 창**에서 시도. `설정 → 앱 → 앱 실행 별칭`에서 Python 별칭 끄기도 가능.

- **증상**: `Set-ExecutionPolicy` 입력했는데도 `Activate.ps1`이 거부됨.
  **해결**: `-Scope CurrentUser`가 빠졌는지 확인. 또는 관리자 PowerShell에서 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned` (시스템 전체)로 시도. 사내 정책이 차단하면 `.venv\Scripts\activate.bat`을 `cmd.exe`에서 실행하는 우회 경로도 있음.

- **증상**: Gemini 호출 시 `GEMINI_API_KEY` 비어 있음.
  **해결**: `setx`나 `[Environment]::SetEnvironmentVariable`은 **새 창**에만 적용됩니다. 기존 PowerShell, Cursor, VS Code를 모두 종료하고 새로 열어 확인.

- **증상**: `pip install google-genai`에서 SSL 인증 오류.
  **해결**: 사내 프록시·PKI 이슈. `pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org google-genai` 또는 사내 IT에 pip 인증서 설정 문의.

## 핵심 요약

- Node.js LTS · Cursor · Python 3.12 세 가지가 오늘의 3대 기둥입니다.
- Gemini API 키는 **환경변수 `GEMINI_API_KEY`에 영구 등록**, 절대 코드에 하드코딩 금지.
- venv로 가상환경을 만들고 `google-genai`를 설치한 뒤 `hello.py` 한 방을 성공시키면 준비 끝.

## 다음 모듈로 가기 전에 (체크리스트)

- [ ] 위 "환경 점검 체크리스트" 8개 전부 `✅`
- [ ] `C:\Users\<사용자>\vibe-1st` 폴더가 존재한다
- [ ] Cursor로 해당 폴더를 열어봤다 (`File → Open Folder`)

## 슬라이드 요약

- 오늘의 공구함 = Node.js + Git + Cursor + Python 3.12 + Gemini 키.
- `GEMINI_API_KEY`는 Windows 환경변수(사용자 변수)로 영구 등록.
- venv 활성화 후 `pip install google-genai`, `python hello.py` 성공이 Step 8 목표.
- 체크리스트 8/8이면 모듈 01로.
- 실패는 대부분 "새 창을 안 열어서" 생깁니다. 창을 새로 여는 습관부터.
