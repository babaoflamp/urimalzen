# Projects Workspace

This workspace contains multiple Korean language learning and AI infrastructure projects.

**Repository URL**: https://github.com/babaoflamp/11_n8n-mz.git

## System Environment

- **OS**: Linux (Ubuntu/Debian) 5.4.0-216-generic
- **GPU**: NVIDIA TITAN Xp (12GB VRAM)
- **CUDA**: 12.8, Driver: 570.133.07
- **Docker**: 26.1.3 with NVIDIA Container Toolkit
- **Storage**: 3.4TB available

## Active Projects

### 1. urimalzen/ - KIIP 기반 한국어 학습 플랫폼 (PRIMARY PROJECT)

**대한민국 이주민을 위한 포괄적 한국어 학습 솔루션**

Full-stack TypeScript application (React 19 + Express 5 + MongoDB) for Korean language learning targeting Mongolian speakers (expandable to other languages).

**Features**:
- KIIP (Korea Immigration & Integration Program) curriculum integration
- TOPIK (Test of Proficiency in Korean) exam preparation
- 14 category-based learning system
- TTS/STT/AI integration (MzTTS, SpeechPro, VocaPro, ComfyUI, Ollama)
- Pronunciation evaluation and recording
- Multi-level ranking system
- Admin dashboard

**Quick Start**:
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name urimalzen-mongodb mongo:latest

# Backend
cd urimalzen/backend
npm install && npm run seed:all && npm run dev

# Frontend (new terminal)
cd urimalzen/frontend
npm install && npm run dev
```

**Access**: http://localhost:5173 (Frontend), http://localhost:5000 (Backend API)

**Admin**: admin@urimalzen.com / admin123!@#

**Documentation**: See `urimalzen/README.md` and `urimalzen/CLAUDE.md`

### 2. open-webui-ollama/ - 로컬 LLM 서비스

GPU를 활용한 로컬 LLM 서비스 구축 프로젝트. Ollama와 Open WebUI를 Docker로 실행하여 Qwen, Mistral, Gemma, EXAONE 등의 모델을 로컬에서 사용합니다.

**Quick Start**:
```bash
cd open-webui-ollama
docker-compose up -d
```

**Access**: http://localhost:3000 (Open WebUI), http://localhost:11434 (Ollama API)

**Models installed**: Qwen 2.5 7B (4.7GB), Mistral 7B (4.4GB), Gemma 2 9B (5.4GB)

### 3. n8n-mz/ - n8n Workflow Automation

TypeScript monorepo for n8n workflow automation platform with 100+ integrations and LangChain AI nodes.

**Quick Start**:
```bash
cd n8n-mz
pnpm install
pnpm dev:be  # Backend only (saves resources)
```

**Requirements**: Node.js >= 22.16, pnpm >= 10.18.3

### 4. comfyui-sd/ - ComfyUI Enterprise Features

Python aiohttp middleware for ComfyUI with JWT auth, OpenAPI docs, and structured logging.

**Quick Start**:
```bash
cd comfyui-sd
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

### 5. Supporting Projects

- **korean-pro-demo/** - Korean language demo project (PostgreSQL-based)
- **k-learning-mz/** - Korean learning platform
- **compass-ai-platform/** - AI platform project

## Technology Stack Summary

| Project | Languages | Key Frameworks | Package Manager |
|---------|-----------|---------------|-----------------|
| urimalzen | TypeScript | React 19, Express 5, Mongoose 8 | npm |
| n8n-mz | TypeScript | Vue 3, Express, TypeORM | pnpm |
| comfyui-sd | Python 3.9+ | aiohttp, PyJWT | pip |
| open-webui-ollama | YAML | Docker, Ollama | docker-compose |

## MCP (Model Context Protocol) Integration

This repository is configured with MCP servers for Claude Code:

- **Filesystem MCP**: Access to `/home/scottk` directory
- **GitHub MCP**: GitHub API integration for repository management

### MCP Server Check
```bash
claude mcp list
```

## Git Workflow

**Main branch**: main

**Remote**: origin (GitHub) - git@github.com:babaoflamp/urimalzen.git

**Committing from**: Project root `/home/scottk/Projects/`

## Documentation

- **Project-specific**: Each project has its own README.md and CLAUDE.md
- **Workspace guide**: See `CLAUDE.md` at repository root for comprehensive development guide

## Performance Considerations

### Resource Usage

- **urimalzen dev servers**: Moderate CPU/memory (frontend + backend)
- **MongoDB**: Docker container overhead
- **n8n full dev mode**: High CPU/memory - use `pnpm dev:be` or `pnpm dev:fe` instead
- **LLM models**: Each 4-9GB, GPU limited to 12GB VRAM
- **ComfyUI SDXL**: ~6-7GB model size, requires GPU

## License

Individual projects may have their own licenses. Check each project directory for details.

**For Immigration Integration & Korean Language Education**
