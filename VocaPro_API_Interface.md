# VocaPro API Interface

openapi: 3.0.0
info:
title: VocaPro API
version: "1.0"
description: 문장 및 단어 분석용 VocaPro API 인터페이스

servers:

- url: [https://api.vocapro.example.com](https://api.vocapro.example.com/)

paths:
/analyze:
post:
summary: 문장 분석 요청
description: 주어진 문장을 분석하여 문장, 단어, 형태소 수준의 분석 결과를 반환합니다.
requestBody:
required: true
content:
application/json:
schema:
type: object
required:
- text
- task_id
- lang
- wsd_model_size
- spacy_model_size
properties:
text:
type: string
description: 분석할 문장
task_id:
type: string
description: 다중화 시 구분용 식별값 (예: "test-client")
lang:
type: string
enum: [kor, chi, jap, eng]
description: 분석할 언어 선택
wsd_model_size:
type: string
enum: [small, medium, large]
description: 의미 분석에 사용할 모델 사이즈 선택
spacy_model_size:
type: string
enum: [small, medium, large]
description: 문장 분석에 사용할 모델 사이즈 선택
responses:
'200':
description: 분석 성공 및 결과 반환
content:
application/json:
schema:
type: object
properties:
task_id:
type: string
description: 요청 시 전달한 식별값
result:
type: object
description: 분석 결과 (문장, 단어, 형태소 수준)
properties:
sentence_level_analysis:
type: array
items:
$ref: '#/components/schemas/SentenceAnalysis'
success:
type: boolean
description: 분석 성공 여부
log:
anyOf:
- type: string
- type: "null"
description: 분석 과정 중 필요한 로그값, 없으면 null

components:
schemas:
SentenceAnalysis:
type: object
properties:
type:
type: string
example: sentence
description: 분석 단위 정보
lang:
type: string
description: 분석 언어
text:
type: string
description: 실제 텍스트 정보
idx:
type: integer
description: 분석 단위 순서
word_level_analysis:
type: array
items:
$ref: '#/components/schemas/WordAnalysis'

```
WordAnalysis:
  type: object
  properties:
    type:
      type: string
      example: word
      description: 분석 단위 정보
    lang:
      type: string
      description: 분석 언어
    text:
      type: string
      description: 실제 텍스트 정보
    idx:
      type: integer
      description: 단어 순서
    lemma:
      type: string
      description: 표제어
    pos:
      type: string
      description: 품사
    is_punct:
      type: boolean
      description: 구두점 여부
    is_stop:
      type: boolean
      description: 불용어 여부
    definition:
      type: string
      description: 사전적 의미
    definition_prob:
      type: number
      format: float
      description: 의미 신뢰 확률
    is_definition_predicted:
      type: boolean
      description: 생성 기반 의미 여부
    usage:
      type: string
      description: 용례
    cefr_level:
      type: string
      description: 단어 레벨 (6단계)
    cefr_score:
      type: number
      format: float
      description: 단어 세부 점수 (0-9 점수)
    is_cefr_predicted:
      type: boolean
      description: 생성 기반 점수 여부
    synonyms:
      type: array
      items:
        type: string
      description: 동의어
    antonyms:
      type: array
      items:
        type: string
      description: 반의어
    hanja:
      type: string
      nullable: true
      description: 한자
    morpheme_level_analysis:
      type: array
      items:
        $ref: '#/components/schemas/MorphemeAnalysis'

MorphemeAnalysis:
  type: object
  properties:
    type:
      type: string
      example: morpheme
      description: 분석 단위 정보
    lang:
      type: string
      description: 분석 언어
    text:
      type: string
      description: 실제 텍스트 정보
    idx:
      type: integer
      description: 형태소 순서
    pos:
      type: string
      description: 품사
    definition:
      type: string
      description: 사전적 의미
    definition_prob:
      type: number
      format: float
    is_definition_predicted:
      type: boolean
    cefr_level:
      type: string
    cefr_score:
      type: number
      format: float
    is_cefr_predicted:
      type: boolean

```