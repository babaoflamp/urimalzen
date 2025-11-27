# ComfyUI 통합 가이드

## 📋 목차
1. [개요](#개요)
2. [ComfyUI 설치](#comfyui-설치)
3. [필수 모델 다운로드](#필수-모델-다운로드)
4. [백엔드 설정](#백엔드-설정)
5. [API 사용법](#api-사용법)
6. [프론트엔드 사용](#프론트엔드-사용)
7. [트러블슈팅](#트러블슈팅)

---

## 개요

우리말젠에 **ComfyUI**를 통합하여 AI 기반 이미지 자동 생성 기능을 구현했습니다.

### 주요 기능
- ✨ **단어 일러스트 생성**: 한국어 단어에 맞는 교육용 이미지 자동 생성
- 🎨 **테마 이미지 생성**: 민들레, 배경 등 커스텀 테마 이미지 생성
- 🔧 **워크플로우 커스터마이징**: JSON 워크플로우를 통한 완전한 제어
- 💰 **무료 로컬 실행**: API 비용 없이 자체 서버에서 실행

---

## ComfyUI 설치

### 1. Python 설치 (3.10 권장)
```bash
python --version  # Python 3.10 이상 확인
```

### 2. ComfyUI 다운로드
```bash
# Git으로 클론
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 또는 릴리스에서 다운로드
# https://github.com/comfyanonymous/ComfyUI/releases
```

### 3. 의존성 설치
```bash
# 가상 환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt

# GPU 사용 시 (NVIDIA)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 4. ComfyUI 실행
```bash
python main.py

# 또는 커스텀 포트로 실행
python main.py --listen 0.0.0.0 --port 8188
```

실행 후 `http://localhost:8188` 에서 ComfyUI 웹 인터페이스를 확인할 수 있습니다.

---

## 필수 모델 다운로드

### Stable Diffusion XL 모델
ComfyUI는 기본적으로 Stable Diffusion 모델이 필요합니다.

#### 1. 모델 다운로드
```bash
cd ComfyUI/models/checkpoints/

# Stable Diffusion XL Base 다운로드 (권장)
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors

# 또는 Hugging Face에서 직접 다운로드
# https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/tree/main
```

#### 2. 모델 위치 확인
```
ComfyUI/
  models/
    checkpoints/
      sd_xl_base_1.0.safetensors  ✅ 이 위치에 있어야 함
```

### 선택적 모델 (품질 향상)
- **VAE**: `sdxl_vae.safetensors` (색상 품질 개선)
- **LoRA**: 특정 스타일 학습 모델
- **ControlNet**: 구조 제어 모델

---

## 백엔드 설정

### 1. 환경 변수 설정
`backend/.env` 파일에 ComfyUI 설정 추가:

```env
# ComfyUI Configuration
COMFYUI_API_URL=http://localhost:8188
```

다른 서버에서 ComfyUI를 실행하는 경우:
```env
COMFYUI_API_URL=http://192.168.1.100:8188
```

### 2. 백엔드 재시작
```bash
cd backend
npm run dev
```

### 3. 연결 테스트
관리자 페이지에서:
1. 로그인 후 **Admin Dashboard** 접속
2. **이미지 생성 (ComfyUI)** 카드 클릭
3. **연결 테스트** 버튼 클릭
4. "ComfyUI 연결 성공!" 메시지 확인

---

## API 사용법

### 백엔드 API 엔드포인트

#### 1. 연결 테스트
```bash
GET /api/comfyui/test
Authorization: Bearer <admin-token>
```

**응답:**
```json
{
  "success": true,
  "message": "ComfyUI 연결 성공!"
}
```

#### 2. 단어 일러스트 생성
```bash
POST /api/comfyui/word-illustration
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "koreanWord": "사과",
  "englishDescription": "red apple on white background"
}
```

**응답:**
```json
{
  "success": true,
  "imagePath": "comfyui/ComfyUI_1234567890.png",
  "message": "이미지가 성공적으로 생성되었습니다."
}
```

#### 3. 테마 이미지 생성
```bash
POST /api/comfyui/theme-image
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "theme": "dandelion seeds floating in the wind",
  "style": "illustration",
  "width": 1024,
  "height": 1024
}
```

**스타일 옵션:**
- `illustration`: 일러스트 스타일
- `realistic`: 사실적인 사진
- `minimal`: 미니멀 디자인

#### 4. 큐 상태 확인
```bash
GET /api/comfyui/queue-status
Authorization: Bearer <admin-token>
```

**응답:**
```json
{
  "success": true,
  "data": {
    "queue_running": 1,
    "queue_pending": 0
  }
}
```

#### 5. 커스텀 워크플로우
```bash
POST /api/comfyui/custom
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "workflow": {
    // ComfyUI JSON 워크플로우
  }
}
```

---

## 프론트엔드 사용

### 관리자 페이지 접속
1. `http://localhost:5173/admin/login` 에서 관리자 로그인
2. Admin Dashboard → **이미지 생성 (ComfyUI)** 클릭

### 단어 일러스트 생성
1. **한국어 단어** 입력 (예: "사과")
2. **영어 설명** 입력 (선택사항, 예: "red apple")
3. **일러스트 생성** 버튼 클릭
4. 생성된 이미지 미리보기 확인

### 테마 이미지 생성
1. **테마** 입력 (예: "dandelion seeds floating in the wind")
2. **스타일** 선택 (일러스트/사실적/미니멀)
3. **너비/높이** 설정 (512-2048px)
4. **테마 이미지 생성** 버튼 클릭

### 생성된 이미지 확인
생성된 이미지는 `backend/uploads/comfyui/` 폴더에 저장됩니다.

웹에서 접근:
```
http://localhost:5000/uploads/comfyui/ComfyUI_1234567890.png
```

---

## 트러블슈팅

### 1. ComfyUI 연결 실패
**증상:** "ComfyUI 연결 실패" 메시지

**해결책:**
```bash
# ComfyUI가 실행 중인지 확인
curl http://localhost:8188/system_stats

# ComfyUI 재시작
cd ComfyUI
python main.py

# 포트 변경 시 .env 파일 확인
COMFYUI_API_URL=http://localhost:8188
```

### 2. 모델을 찾을 수 없음
**증상:** "checkpoint not found" 오류

**해결책:**
```bash
# 모델 파일 위치 확인
ls ComfyUI/models/checkpoints/

# sd_xl_base_1.0.safetensors 파일이 있는지 확인
# 없으면 다운로드
cd ComfyUI/models/checkpoints/
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

### 3. 이미지 생성 시간 초과
**증상:** "이미지 생성 시간 초과" 메시지

**해결책:**
- GPU 없이 CPU로 실행 시 5-10분 소요 가능
- `comfyuiService.ts`의 `maxWaitTime` 값 증가:
  ```typescript
  const imageInfo = await waitForCompletion(promptId, 300000); // 5분
  ```

### 4. 메모리 부족
**증상:** "CUDA out of memory" 또는 프로세스 종료

**해결책:**
```bash
# 이미지 크기 줄이기 (512x512로 시작)
# 또는 --lowvram 옵션으로 ComfyUI 실행
python main.py --lowvram

# CPU 모드로 실행
python main.py --cpu
```

### 5. 포트 충돌
**증상:** "Port 8188 already in use"

**해결책:**
```bash
# 다른 포트로 실행
python main.py --port 8189

# .env 파일 업데이트
COMFYUI_API_URL=http://localhost:8189
```

---

## 워크플로우 커스터마이징

`comfyuiService.ts`의 `getBasicWorkflow()` 함수를 수정하여 워크플로우를 변경할 수 있습니다.

### 예시: LoRA 추가
```typescript
const workflow = {
  // ... 기존 노드들
  "10": {
    "inputs": {
      "lora_name": "korean_style.safetensors",
      "strength_model": 0.8,
      "strength_clip": 0.8,
      "model": ["4", 0],
      "clip": ["4", 1]
    },
    "class_type": "LoraLoader"
  }
};
```

### ComfyUI에서 워크플로우 내보내기
1. ComfyUI 웹 인터페이스에서 워크플로우 구성
2. **Save (API Format)** 버튼 클릭
3. JSON 파일 저장
4. `/api/comfyui/custom` 엔드포인트로 전송

---

## 성능 최적화

### GPU 사용 (권장)
- NVIDIA GPU (8GB+ VRAM)
- CUDA 11.8 이상
- 생성 시간: 10-30초

### CPU 사용
- 16GB+ RAM 권장
- 생성 시간: 5-10분
- `--lowvram` 또는 `--cpu` 옵션 사용

### 이미지 크기 권장
- **빠른 생성**: 512x512
- **균형**: 768x768
- **고품질**: 1024x1024

---

## 참고 자료

- [ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI)
- [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- [ComfyUI 커스텀 노드](https://github.com/ltdrdata/ComfyUI-Manager)

---

## 문의 및 지원

문제가 발생하면 다음을 확인하세요:
1. ComfyUI 로그: `ComfyUI/comfyui.log`
2. 백엔드 로그: 콘솔 출력
3. 프론트엔드 콘솔: 브라우저 개발자 도구

---

**🎉 ComfyUI 통합 완료!**

이제 우리말젠에서 AI 기반 이미지 생성 기능을 사용할 수 있습니다.
