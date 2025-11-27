# SpeechPro External API Specification

이 문서는 **SpeechPro Korean Engine**과의 외부 통합을 위한 API 명세서입니다.  
본 명세서는 `SpDemoService.java` 및 `application.yml` 설정을 기반으로 작성되었습니다.

## 1. 개요

- **Base URL**: `http://112.220.79.222:33005/speechpro`
- **프로토콜**: HTTP/1.1
- **응답 형식**: JSON

---

## 2. API 엔드포인트

### 2.1. GTP (Grapheme-to-Phoneme)
입력된 한국어 텍스트를 음소(Phoneme)로 변환하고 음절(Syllable) 단위로 분리합니다.

- **URL**: `/gtp`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "id": "string",   // 요청 ID (예: 문제 ID)
  "text": "string"  // 변환할 한국어 문장
}
```

> **Note**: `text` 필드는 전송 전 공백 정규화(NBSP 제거 등) 처리가 권장됩니다.

#### Response Body

```json
{
  "id": "string",
  "text": "string",
  "syll ltrs": "string", // 글자 단위 구분자 ('_'로 구분)
  "syll phns": "string", // 글자 단위 발음열 ('_'로 구분)
  "error code": 0        // 성공 시 0
}
```

---

### 2.2. Model (발음 모델 생성)
GTP 단계에서 생성된 음소 정보를 바탕으로 발음 평가를 위한 FST(Finite State Transducer) 모델을 생성합니다.

- **URL**: `/model`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "id": "string",
  "text": "string",
  "syll ltrs": "string", // GTP 응답의 'syll ltrs' 값
  "syll phns": "string"  // GTP 응답의 'syll phns' 값
}
```

#### Response Body

```json
{
  "id": "string",
  "text": "string",
  "syll ltrs": "string",
  "syll phns": "string",
  "fst": "string",       // 생성된 발음 모델 데이터
  "error code": 0
}
```

---

### 2.3. Score JSON (발음 평가)
사용자의 음성 데이터(Base64)를 전송하여 생성된 모델과 비교해 발음 정확도를 평가합니다.

- **URL**: `/scorejson`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

```json
{
  "id": "string",        // 문제 ID
  "text": "string",      // 원문 텍스트 (공백 정규화됨)
  "syll ltrs": "string", // 저장된 음절 문자열
  "syll phns": "string", // 저장된 음절 음소열
  "fst": "string",       // 저장된 발음 모델 (Model API 결과)
  "wav usr": "string"    // Base64로 인코딩된 WAV 오디오 데이터
}
```

#### Response Body

평가 결과 JSON 객체가 반환됩니다. 상세 구조는 엔진 버전에 따라 다를 수 있으나, 일반적으로 점수 및 음소별 정확도 정보를 포함합니다.

```json
{
  "score": 85.5,
  "details": { ... },
  "error code": 0
}
```

---

## 3. 통합 워크플로우

### 3.1. 문장 등록 및 모델 생성 (관리자/시스템)
1. **GTP 호출**: 텍스트를 전송하여 `syll ltrs`, `syll phns` 획득.
2. **Model 호출**: 위에서 얻은 정보를 포함하여 전송, `fst` 획득.
3. **DB 저장**: `text`, `syll ltrs`, `syll phns`, `fst`를 데이터베이스에 저장.

### 3.2. 발음 평가 (사용자)
1. **녹음**: 사용자 음성을 WAV 포맷으로 녹음.
2. **인코딩**: 녹음 파일을 Base64 문자열로 변환.
3. **데이터 조회**: 평가할 문장의 `fst` 및 관련 정보를 DB에서 조회.
4. **Score 호출**: 모든 정보를 조합하여 API 요청.
5. **결과 처리**: 반환된 점수 및 피드백을 사용자에게 표시.

## 4. 참고 사항 (Java Implementation)

`SpDemoService.java` 내 `normalizeSpaces` 메소드를 통해 다음과 같은 특수 공백 문자를 일반 공백(` `)으로 치환 후 API를 호출합니다:
- `\u00A0` (NBSP)
- `\u2002` (En Space)
- `\u2003` (Em Space)
- `\u2009` (Thin Space)
- `\t` (Tab)
