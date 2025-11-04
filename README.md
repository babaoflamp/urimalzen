# Open WebUI + Ollama 로컬 LLM 서비스

GPU를 활용한 로컬 LLM 서비스 구축 프로젝트입니다. Ollama와 Open WebUI를 Docker로 실행하여 Qwen, Mistral, Gemma, EXAONE 등의 모델을 로컬에서 사용합니다.

## 시스템 환경

- **OS**: Linux (Ubuntu/Debian)
- **GPU**: NVIDIA TITAN Xp (12GB VRAM)
- **CUDA**: 12.8
- **Driver**: 570.133.07
- **디스크**: 3.4TB 사용 가능

## 설치 플랜

### 1단계: Docker 및 필수 도구 설치
- Docker 설치 및 활성화
- Docker Compose 플러그인 설치
- 사용자를 docker 그룹에 추가 (sudo 없이 사용)

### 2단계: NVIDIA Container Toolkit 설치
- NVIDIA Container Toolkit 저장소 추가
- nvidia-container-toolkit 설치
- Docker에 NVIDIA 런타임 설정
- Docker 재시작

### 3단계: Docker Compose 설정 파일 작성
- `docker-compose.yml` 생성:
  - Ollama 서비스 (GPU 활성화)
  - Open WebUI 서비스 (Ollama 연결)
  - 볼륨 설정 (모델 및 데이터 영구 저장)
  - 네트워크 설정

### 4단계: 서비스 실행
- Docker Compose로 Ollama + Open WebUI 컨테이너 실행
- 서비스 정상 작동 확인

### 5단계: LLM 모델 다운로드
- Qwen 모델 다운로드
- Mistral 모델 다운로드
- Gemma 모델 다운로드
- EXAONE 모델 다운로드 (사용 가능한 경우)

### 6단계: 서비스 접속 확인
- Open WebUI 웹 인터페이스 접속
- 초기 계정 설정
- 다운로드한 모델로 테스트

## 예상 요구사항

- **설치 시간**: 30-60분 (모델 다운로드 제외)
- **디스크 사용량**: 30-100GB (모델 크기에 따라)
- **메모리**: 최소 8GB RAM 권장
- **GPU VRAM**: 12GB (NVIDIA TITAN Xp)

## 작업 진행 상황

- [x] Docker 및 Docker Compose 설치 (완료)
  - Docker 26.1.3
  - Docker Compose v2.40.3
- [x] NVIDIA Container Toolkit 설치 (완료)
  - v1.18.0
  - GPU Docker 테스트 성공
- [x] docker-compose.yml 생성 (완료)
- [x] Ollama + Open WebUI 서비스 실행 (완료)
  - Ollama 컨테이너: 포트 11434
  - Open WebUI 컨테이너: 포트 3000 (healthy)
- [x] MCP (Model Context Protocol) 설정 (완료)
  - Filesystem MCP: /home/scottk 접근
  - GitHub MCP: GitHub API 통합
- [ ] LLM 모델 다운로드 (진행 중)
  - Qwen 2.5 7B
  - Mistral 7B
  - Gemma 2 9B
- [ ] 서비스 테스트 및 확인

## 사용 방법

### 서비스 시작
```bash
cd open-webui-ollama
docker-compose up -d
```

### 서비스 중지
```bash
docker-compose down
```

### 로그 확인
```bash
docker-compose logs -f
```

### Open WebUI 접속
브라우저에서 http://localhost:3000 접속

### Ollama API 엔드포인트
http://localhost:11434

### LLM 모델 다운로드
```bash
# Qwen 2.5 7B
docker exec ollama ollama pull qwen2.5:7b

# Mistral 7B
docker exec ollama ollama pull mistral:7b

# Gemma 2 9B
docker exec ollama ollama pull gemma2:9b

# 다운로드된 모델 확인
docker exec ollama ollama list
```

## MCP (Model Context Protocol) 설정

Claude Code에서 MCP를 통해 외부 서비스와 통합할 수 있습니다.

### 설정된 MCP 서버

1. **Filesystem MCP**: 로컬 파일시스템 접근
   - 경로: /home/scottk

2. **GitHub MCP**: GitHub API 통합
   - 저장소, 이슈, PR 관리 가능

### MCP 서버 확인
```bash
claude mcp list
```

## 라이선스

이 프로젝트는 오픈소스 도구들을 활용한 개인 학습 및 연구 목적입니다.
