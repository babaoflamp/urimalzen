# 프로젝트 워크스페이스

한국어 학습 및 AI 인프라 관련 프로젝트들을 포함하는 워크스페이스입니다.

**저장소 URL**: https://github.com/babaoflamp/urimalzen.git

## 시스템 환경

- **OS**: Linux (Ubuntu/Debian) 5.4.0-216-generic
- **GPU**: NVIDIA TITAN Xp (12GB VRAM)
- **CUDA**: 12.8, Driver: 570.133.07
- **Docker**: 26.1.3 with NVIDIA Container Toolkit
- **스토리지**: 3.4TB 사용 가능

## 활성 프로젝트

### 1. urimalzen/ - KIIP 기반 한국어 학습 플랫폼 (주요 프로젝트)

**대한민국 이주민을 위한 포괄적 한국어 학습 솔루션**

몽골어 사용자를 대상으로 한 한국어 학습 풀스택 TypeScript 애플리케이션 (React 19 + Express 5 + MongoDB). 향후 다양한 언어로 확장 가능합니다.

**주요 기능**:
- KIIP (Korea Immigration & Integration Program) 커리큘럼 통합
- TOPIK (Test of Proficiency in Korean) 시험 대비
- 14개 카테고리 기반 학습 시스템
- TTS/STT/AI 통합 (MzTTS, SpeechPro, VocaPro, ComfyUI, Ollama)
- 발음 평가 및 녹음 기능
- 다중 레벨 랭킹 시스템
- 관리자 대시보드

**빠른 시작**:
```bash
# MongoDB 시작
docker run -d -p 27017:27017 --name urimalzen-mongodb mongo:latest

# 백엔드
cd urimalzen/backend
npm install && npm run seed:all && npm run dev

# 프론트엔드 (새 터미널)
cd urimalzen/frontend
npm install && npm run dev
```

**접속**: http://localhost:5173 (프론트엔드), http://localhost:5000 (백엔드 API)

**관리자**: admin@urimalzen.com / admin123!@#

**문서**: `urimalzen/README.md` 및 `urimalzen/CLAUDE.md` 참조

### 2. open-webui-ollama/ - 로컬 LLM 서비스

GPU를 활용한 로컬 LLM 서비스 구축 프로젝트입니다. Ollama와 Open WebUI를 Docker로 실행하여 Qwen, Mistral, Gemma, EXAONE 등의 모델을 로컬에서 사용합니다.

**빠른 시작**:
```bash
cd open-webui-ollama
docker-compose up -d
```

**접속**: http://localhost:3000 (Open WebUI), http://localhost:11434 (Ollama API)

**설치된 모델**: Qwen 2.5 7B (4.7GB), Mistral 7B (4.4GB), Gemma 2 9B (5.4GB)

### 3. n8n-mz/ - n8n 워크플로우 자동화

100개 이상의 통합 기능과 LangChain AI 노드를 제공하는 n8n 워크플로우 자동화 플랫폼 TypeScript 모노레포입니다.

**빠른 시작**:
```bash
cd n8n-mz
pnpm install
pnpm dev:be  # 백엔드만 실행 (리소스 절약)
```

**요구사항**: Node.js >= 22.16, pnpm >= 10.18.3

### 4. comfyui-sd/ - ComfyUI 엔터프라이즈 기능

JWT 인증, OpenAPI 문서, 구조화된 로깅을 제공하는 ComfyUI용 Python aiohttp 미들웨어입니다.

**빠른 시작**:
```bash
cd comfyui-sd
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

### 5. 지원 프로젝트

- **korean-pro-demo/** - 한국어 학습 데모 프로젝트 (PostgreSQL 기반)
- **k-learning-mz/** - 한국어 학습 플랫폼
- **compass-ai-platform/** - AI 플랫폼 프로젝트

## 기술 스택 요약

| 프로젝트 | 언어 | 주요 프레임워크 | 패키지 매니저 |
|---------|------|---------------|-------------|
| urimalzen | TypeScript | React 19, Express 5, Mongoose 8 | npm |
| n8n-mz | TypeScript | Vue 3, Express, TypeORM | pnpm |
| comfyui-sd | Python 3.9+ | aiohttp, PyJWT | pip |
| open-webui-ollama | YAML | Docker, Ollama | docker-compose |

## MCP (Model Context Protocol) 통합

이 저장소는 Claude Code를 위한 MCP 서버로 구성되어 있습니다:

- **Filesystem MCP**: `/home/scottk` 디렉토리 접근
- **GitHub MCP**: GitHub API 통합을 통한 저장소 관리

### MCP 서버 확인
```bash
claude mcp list
```

## Git 워크플로우

**메인 브랜치**: main

**원격 저장소**: origin (GitHub) - https://github.com/babaoflamp/urimalzen.git

**커밋 위치**: 프로젝트 루트 `/home/scottk/Projects/`

## 문서

- **프로젝트별 문서**: 각 프로젝트는 자체 README.md 및 CLAUDE.md를 포함
- **워크스페이스 가이드**: 포괄적인 개발 가이드는 저장소 루트의 `CLAUDE.md` 참조

## 성능 고려사항

### 리소스 사용량

- **urimalzen 개발 서버**: 중간 수준 CPU/메모리 (프론트엔드 + 백엔드)
- **MongoDB**: Docker 컨테이너 오버헤드
- **n8n 전체 개발 모드**: 높은 CPU/메모리 - 대신 `pnpm dev:be` 또는 `pnpm dev:fe` 사용 권장
- **LLM 모델**: 각각 4-9GB, GPU는 12GB VRAM으로 제한
- **ComfyUI SDXL**: 모델 크기 약 6-7GB, GPU 필요

## 라이선스

개별 프로젝트는 자체 라이선스를 가질 수 있습니다. 자세한 내용은 각 프로젝트 디렉토리를 확인하세요.

**대한민국 이주민 통합 및 한국어 교육을 위하여**
