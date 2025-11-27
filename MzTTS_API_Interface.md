첨부하신 MzTTS REST API 명세서 PDF 문서 전체를 마크다운(MD) 형식으로 완성본 형태로 변환해 드립니다. 구조와 내용을 가능한 한 원문에 가깝게 살려서 작성하였으며, 이해하기 쉬운 제목, 코드 블록, 표기법 등을 포함합니다.

***

# MzTTS REST API 명세서

## 1. GET 요청

### 1.1 서버 정보 조회  
- **URI:** 기본 서버 주소  
- **예시:**  
```bash
curl -X GET http://192.168.123.33:7779
```
- **응답 예시:**
```json
{
  "code": 200,
  "message": "MzTTS Server Information",
  "result": {
    "MODELVERSION": "kor-multi-22khz-mz8-iflytek-ver4-2401198",
    "NUMCHANNEL": 1,
    "NUMMODEL": 1,
    "SAMPLINGBITS": 16,
    "SAMPLINGRATE": 22050,
    "SPEAKERNAME": [
      "Jieun-neutral", "Jieun-pleasure", "Jieun-anger", "Jieun-sadness",
      "Seojun-neutral", "Seojun-pleasure", "Seojun-anger", "Seojun-sadness"
    ],
    "TTSVERSION": "MZTTS.1.5.2.240306"
  }
}
```
- **설명:** 서버의 TTS 엔진 버전, 샘플링 정보, 스피커 목록 등을 확인할 수 있음.

***

### 1.2 파일 다운로드  
- **URI:** `http://192.168.123.33:7779/file/drop/파일명.wav`  
- **예시:**  
```bash
curl -X GET http://192.168.123.33:7779/file/drop/20240222160112180822.wav --output a.wav
```
- **설명:** 음성 합성된 wav 파일 다운로드 가능.  
- **파일 정보:** 채널 수, 비트수, 샘플링 레이트 등이 포함됨.

***

### 1.3 서버 동작 상태 확인  
- **URI:** `/check-server`  
- **예시:**  
```bash
curl -X GET http://192.168.123.33:7779/check-server
```
- **응답 예시:** 서버 연결 상태, 작업중인 서버 수, 스레드 수, 부하, 실시간 처리 속도, 처리 전력 등 상세 서버 상태 데이터 반환.

***

### 1.4 단어 교체 정보 조회  
- **URI:** `/word-replace`  
- **예시:**  
```bash
curl -X GET http://192.168.123.33:7779/word-replace
```
- **응답:** 등록된 단어 치환 목록 확인 가능.

***

## 2. POST 요청

### 2.1 TTS 요청  
- **URI:** 기본 서버 주소  
- **헤더:** `Content-Type: application/json`  
- **본문 예시:**
```json
{
  "outputtype": "path",
  "DEFAULTMODEL": 0,
  "DEFAULTSPEAKER": 4,
  "DEFAULTTEMPO": 1.0,
  "DEFAULTPITCH": 1.0,
  "DEFAULTGAIN": 1.0,
  "CONVRATE": 0,
  "TEXT": "변환할 텍스트"
}
```
- **응답 예시:**
```json
{
  "code": 200,
  "message": "TTS execution success",
  "result": {
    "NUMCHANNEL": 1,
    "SAMPLINGBITS": 16,
    "SAMPLINGRATE": 22050,
    "outputtype": "path",
    "path": "filedrop20240307142517180822.wav"
  }
}
```
- **설명:** 텍스트를 음성으로 변환하고 결과 wav 파일 경로나 데이터를 반환.

***

### 2.2 TTS 요청 입력 형식  
- 주요 필드:
  - `outputtype`: `"file"`, `"pcm"`, `"path"` 중 선택 (출력 형태 지정)
  - `DEFAULTMODEL`: 모델 번호 (기본 0)
  - `DEFAULTSPEAKER`: 스피커 번호
  - `DEFAULTTEMPO`: 음성 속도 (0.1~2.0)
  - `DEFAULTPITCH`: 음높이 (0.1~2.0)
  - `DEFAULTGAIN`: 음량 (0.1~2.0)
  - `DEFAULTPAUSE`: 구간 간 간격
  - `CONVRATE`: 변환 비율 (0~)
  - `CACHE`: 캐시 사용 여부 ("on", "off")
  - `TEXT`: 변환할 UTF-8 인코딩 텍스트

***

### 2.3 TTS 출력 형태 상세

| outputtype | 설명                                                    | 반환 형태                  |
|------------|---------------------------------------------------------|----------------------------|
| file       | wav 파일 직접 다운로드                                  | wav 파일 직접 전달          |
| pcm        | base64 인코딩된 음성 PCM 데이터                       | JSON 바디 내 base64 인코딩 |
| path       | 서버 내 wav 파일 경로를 JSON으로 전달                | 경로 문자열 반환            |

***

### 2.4 단어 교체 기능

#### 2.4.1 단어 교체 추가  
- **URI:** `/word-replace`  
- **헤더:** `Content-Type: application/json`  
- **본문 예시:**
```json
[
  {
    "command": "insert",
    "words": {
      "from": "테스트",
      "to": "시험"
    }
  }
]
```
- **응답:** 성공 또는 실패 메시지 반환

#### 2.4.2 단어 교체 삭제  
- **URI:** `/word-replace`  
- **본문 예시:**
```json
[
  {
    "command": "delete",
    "words": "테스트"
  }
]
```
- **응답:** 삭제 성공 메시지 반환

***

# 부가 설명

- 각 API 엔드포인트는 JSON 데이터를 주고받으며, 텍스트 음성 변환 및 관련 서버 정보 확인에 최적화되어 있습니다.
- 클라이언트는 curl 명령어 예시처럼 HTTP 요청을 통해 음성 합성, 파일 다운로드, 서버 상태 점검 그리고 단어 교체 관리가 가능합니다.
- 음성 샘플링 주파수, 채널, 비트 수는 응답 결과로 함께 제공되어 클라이언트가 음성 재생 환경을 조정할 수 있습니다.

***