# n8n-mz: n8n Workflow Automation with AI Integration

n8n 워크플로우 자동화 플랫폼과 AI 통합을 위한 개발 환경입니다.

## 프로젝트 개요

이 저장소는 n8n 워크플로우 자동화 플랫폼을 기반으로 한 프로젝트로, Ollama, Open WebUI 등의 AI 도구들과 통합하여 강력한 자동화 솔루션을 제공합니다.

## 주요 구성 요소

- **n8n**: 워크플로우 자동화 플랫폼 (TypeScript 기반 모노레포)
- **Ollama**: 로컬 LLM 실행 환경
- **Open WebUI**: LLM과 상호작용을 위한 웹 인터페이스
- **Docker & NVIDIA Container Toolkit**: 컨테이너화 및 GPU 가속

## 디렉토리 구조

```
11_n8n-mz/
├── n8n/                    # n8n 워크플로우 자동화 플랫폼
│   ├── packages/           # n8n 패키지들 (모노레포)
│   │   ├── cli/           # CLI 및 백엔드 서버
│   │   ├── editor-ui/     # Vue.js 프론트엔드
│   │   ├── core/          # 워크플로우 실행 엔진
│   │   ├── nodes-base/    # 기본 노드 통합
│   │   └── ...
│   └── CLAUDE.md          # n8n 개발 가이드 (Claude Code용)
└── README.md              # 이 파일
```

## 빠른 시작

### 사전 요구사항

- **Node.js**: >= 22.16
- **pnpm**: >= 10.18.3
- **Docker**: 최신 버전 (선택사항)
- **NVIDIA GPU 드라이버**: GPU 가속이 필요한 경우

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone https://github.com/babaoflamp/11_n8n-mz.git
cd 11_n8n-mz
```

#### 2. n8n 설정

```bash
cd n8n

# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# 개발 모드로 실행
pnpm dev

# 또는 프로덕션 모드로 실행
pnpm start
```

n8n이 실행되면 브라우저에서 http://localhost:5678 로 접속할 수 있습니다.

#### 3. 선택적 개발 모드

리소스를 절약하기 위해 필요한 부분만 개발 모드로 실행:

```bash
# 백엔드만
pnpm dev:be

# 프론트엔드만
pnpm dev:fe

# AI/LangChain 노드 개발
pnpm dev:ai
```

## 개발 가이드

### n8n 개발

n8n 개발에 대한 자세한 내용은 [`n8n/CLAUDE.md`](./n8n/CLAUDE.md)를 참조하세요. 여기에는 다음 내용이 포함되어 있습니다:

- 필수 명령어 (빌드, 테스트, 린트)
- 아키텍처 개요 및 패키지 구조
- TypeScript 모범 사례
- 테스트 작성 가이드
- GitHub PR 작성 규칙

### 일반적인 명령어

```bash
# n8n 디렉토리로 이동
cd n8n

# 개발 모드 시작 (핫 리로드)
pnpm dev

# 테스트 실행
pnpm test

# 린트 및 타입 체크
pnpm lint
pnpm typecheck

# 빌드
pnpm build

# 프로덕션 모드로 시작
pnpm start
```

### 커스텀 노드 개발

n8n에서 커스텀 노드를 개발하려면:

```bash
# Terminal 1: 노드 패키지 감시
cd n8n/packages/nodes-base
pnpm watch

# Terminal 2: CLI 핫 리로드로 실행
cd n8n/packages/cli
N8N_DEV_RELOAD=true pnpm dev
```

## 기술 스택

### n8n 플랫폼

- **프론트엔드**: Vue 3, TypeScript, Vite, Pinia
- **백엔드**: Node.js, Express, TypeORM
- **데이터베이스**: SQLite/PostgreSQL/MySQL (TypeORM)
- **테스팅**: Jest (유닛), Vitest (프론트엔드), Playwright (E2E)
- **빌드 시스템**: Turbo (모노레포), pnpm workspaces

### AI 통합 도구

- **Ollama**: 로컬 LLM 실행
- **Open WebUI**: LLM 웹 인터페이스
- **LangChain**: AI 워크플로우 (`@n8n/nodes-langchain`)

## 프로젝트 히스토리

- ✅ Docker 및 NVIDIA Container Toolkit 설치 완료
- ✅ Ollama + Open WebUI 설치 계획 추가
- ✅ 서비스 및 MCP 구성 업데이트
- ✅ LLM 모델 다운로드 및 설정 완료

## 문제 해결

### 빌드 오류

빌드 로그를 파일로 리다이렉트하여 확인:

```bash
cd n8n
pnpm build > build.log 2>&1
tail -n 20 build.log
```

### 메모리 부족

전체 `pnpm dev`는 리소스 집약적입니다. 대신 선택적 개발 모드 사용:

```bash
pnpm dev:be  # 백엔드만
pnpm dev:fe  # 프론트엔드만
```

### 테스트 실패

패키지 디렉토리 내에서 테스트 실행:

```bash
cd n8n/packages/cli
pnpm test
```

## 기여하기

1. 새 브랜치 생성
2. 변경사항 작성
3. 테스트 및 린트 실행: `pnpm test && pnpm lint && pnpm typecheck`
4. 커밋 및 PR 생성

PR 작성 규칙은 [`n8n/CLAUDE.md`](./n8n/CLAUDE.md)의 GitHub Guidelines 섹션을 참조하세요.

## 리소스

- [n8n 공식 문서](https://docs.n8n.io)
- [n8n GitHub](https://github.com/n8n-io/n8n)
- [n8n 커뮤니티 포럼](https://community.n8n.io)
- [Ollama 문서](https://ollama.ai/docs)
- [LangChain 문서](https://docs.langchain.com)

## 라이선스

n8n은 [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)와 [n8n Enterprise License](https://github.com/n8n-io/n8n/blob/master/LICENSE_EE.md) 하에 배포됩니다.

## 연락처

문제나 질문이 있으면 이슈를 생성해주세요.
