# Urimalzen 데이터베이스 구조

> 생성일: 2025년 11월 21일  
> 데이터베이스: MongoDB (urimalzen)  
> 컨테이너: urimalzen-mongodb (포트: 27017)

## 📊 데이터베이스 개요

### 컬렉션 목록
1. **users** - 사용자 정보
2. **words** - 한국어 단어 및 학습 콘텐츠
3. **categories** - 단어 카테고리
4. **userprogresses** - 사용자 학습 진행상황
5. **recordings** - 사용자 발음 녹음
6. **rankings** - 사용자 랭킹
7. **pronunciationevaluations** - 발음 평가 결과
8. **phonemerules** - 음소 규칙
9. **units** - 학습 단원
10. **audiocontents** - 오디오 콘텐츠

---

## 📋 컬렉션 상세 정보

### 1. Users (사용자)
**총 개수**: 3명

#### 스키마 구조
```javascript
{
  username: String,          // 사용자 이름
  email: String,            // 이메일
  password: String,         // 암호화된 비밀번호
  isAdmin: Boolean,         // 관리자 여부
  level: {
    cefr: String,          // CEFR 레벨 (A1-C2)
    kiip: Number           // KIIP 레벨 (0-5)
  },
  nativeLanguage: String,   // 모국어
  createdAt: Date,
  updatedAt: Date
}
```

#### 등록된 사용자
| Username | Email | Admin | CEFR Level | KIIP Level |
|----------|-------|-------|------------|------------|
| 김영훈 | yh.kim@mediazen.co.kr | ✅ | A1 | 1 |
| admin | admin@urimalzen.com | ✅ | C2 | 5 |
| test | test@test.com | ✅ | A1 | 1 |

---

### 2. Words (단어)
**총 개수**: 73개

#### 스키마 구조
```javascript
{
  koreanWord: String,           // 한국어 단어
  mongolianWord: String,        // 몽골어 번역
  imageUrl: String,             // 이미지 URL
  description: String,          // 단어 설명
  pronunciation: String,        // 발음 표기
  category: String,             // 카테고리
  order: Number,                // 정렬 순서
  examples: [{
    korean: String,             // 한국어 예문
    mongolian: String,          // 몽골어 예문
  }],
  synonyms: [String],           // 동의어
  antonyms: [String],           // 반의어
  videoUrl: String,             // 비디오 URL
  readingContent: String,       // 읽기 콘텐츠
  level: {
    kiip: Number,               // KIIP 레벨
    cefr: String                // CEFR 레벨
  },
  mainCategory: String,         // 주 카테고리
  subCategory: String,          // 하위 카테고리
  phonemeRules: [ObjectId],     // 음소 규칙 참조
  standardPronunciation: String, // 표준 발음
  collocations: [String],       // 연어
  relatedWords: [String],       // 관련 단어
  difficultyScore: Number,      // 난이도 점수
  frequencyRank: Number,        // 빈도 순위
  wordType: String,             // 품사 (noun, verb, etc.)
  formalityLevel: String,       // 격식 수준
  culturalNote: String,         // 문화적 참고사항
  createdAt: Date,
  updatedAt: Date
}
```

#### 단어 예시
**단어**: 민들레 (Цэцэрлэг)
- **설명**: 민들레는 봄에 노란 꽃이 피는 다년생 식물입니다. 꽃이 진 후에는 흰 솜털 같은 씨앗이 바람에 날아갑니다.
- **발음**: min-deul-le
- **카테고리**: flower (꽃)
- **레벨**: KIIP 1, CEFR A1
- **예문**: "봄에 민들레 꽃이 핀다" / "Хавар цэцэрлэг цэцэглэнэ"
- **동의어**: 만들레

---

### 3. Categories (카테고리)
**총 개수**: 14개

#### 카테고리 목록
1. 인간
2. 식생활
3. 의생활
4. 주생활
5. 건강과 안전
6. 교육
7. 직업과 일
8. 여가와 취미
9. 경제 생활
10. 교통과 통신
11. 장소와 지역
12. 자연과 환경
13. 사회와 문화
14. 인간관계와 소통

#### 스키마 구조
```javascript
{
  name: String,              // 카테고리 이름
  description: String,       // 카테고리 설명
  icon: String,             // 아이콘
  wordCount: Number,        // 단어 개수
  createdAt: Date,
  updatedAt: Date
}
```

---

### 4. UserProgresses (학습 진행상황)
**총 개수**: 3개

#### 스키마 구조
```javascript
{
  userId: ObjectId,          // 사용자 참조
  wordId: ObjectId,          // 단어 참조
  completed: Boolean,        // 완료 여부
  masteryLevel: Number,      // 숙달 수준 (0-100)
  lastPracticed: Date,       // 마지막 학습 시간
  correctCount: Number,      // 정답 횟수
  totalAttempts: Number,     // 총 시도 횟수
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5. Recordings (녹음)
**총 개수**: 3개

#### 스키마 구조
```javascript
{
  userId: ObjectId,          // 사용자 참조
  wordId: ObjectId,          // 단어 참조
  audioUrl: String,          // 오디오 파일 URL
  score: Number,             // 발음 점수
  feedback: String,          // 피드백
  duration: Number,          // 녹음 길이 (초)
  createdAt: Date
}
```

---

### 6. Rankings (랭킹)
**총 개수**: 4개

#### 스키마 구조
```javascript
{
  userId: ObjectId,          // 사용자 참조
  username: String,          // 사용자 이름
  totalScore: Number,        // 총 점수
  level: {
    kiip: Number,
    cefr: String
  },
  wordsCompleted: Number,    // 완료한 단어 수
  averageScore: Number,      // 평균 점수
  rank: Number,              // 순위
  lastUpdated: Date,
  createdAt: Date
}
```

---

### 7. PhonemeRules (음소 규칙)
**총 개수**: 5개

#### 스키마 구조
```javascript
{
  ruleName: String,          // 규칙 이름
  description: String,       // 규칙 설명
  examples: [{
    original: String,        // 원본
    pronounced: String,      // 발음
    explanation: String      // 설명
  }],
  category: String,          // 카테고리
  difficulty: String,        // 난이도
  createdAt: Date,
  updatedAt: Date
}
```

#### 등록된 음소 규칙
1. **연음**: 받침이 뒤의 모음으로 이어지는 현상
2. **비음화**: 받침 ㄱ, ㄷ, ㅂ이 비음 ㄴ, ㅁ 앞에서 ㅇ, ㄴ, ㅁ으로 변하는 현상
3. (외 3개)

---

### 8. PronunciationEvaluations (발음 평가)
**총 개수**: 0개

#### 스키마 구조
```javascript
{
  userId: ObjectId,          // 사용자 참조
  wordId: ObjectId,          // 단어 참조
  recordingId: ObjectId,     // 녹음 참조
  overallScore: Number,      // 전체 점수
  accuracyScore: Number,     // 정확도 점수
  fluencyScore: Number,      // 유창성 점수
  completenessScore: Number, // 완전성 점수
  phonemeScores: [{
    phoneme: String,         // 음소
    score: Number            // 점수
  }],
  feedback: String,          // 피드백
  suggestions: [String],     // 개선 제안
  createdAt: Date
}
```

---

### 9. Units (학습 단원)
**총 개수**: 데이터 미확인

#### 스키마 구조
```javascript
{
  title: String,             // 단원 제목
  description: String,       // 단원 설명
  level: {
    kiip: Number,
    cefr: String
  },
  words: [ObjectId],         // 단어 참조 배열
  order: Number,             // 순서
  estimatedTime: Number,     // 예상 소요 시간 (분)
  createdAt: Date,
  updatedAt: Date
}
```

---

### 10. AudioContents (오디오 콘텐츠)
**총 개수**: 데이터 미확인

#### 스키마 구조
```javascript
{
  wordId: ObjectId,          // 단어 참조
  audioUrl: String,          // 오디오 파일 URL
  type: String,              // 타입 (standard, slow, example)
  speaker: String,           // 화자 정보
  gender: String,            // 성별
  duration: Number,          // 재생 시간 (초)
  quality: String,           // 품질
  createdAt: Date
}
```

---

## 🔗 관계도

```
Users (사용자)
  ├─→ UserProgresses (학습 진행)
  ├─→ Recordings (녹음)
  ├─→ Rankings (랭킹)
  └─→ PronunciationEvaluations (발음 평가)

Words (단어)
  ├─→ Categories (카테고리)
  ├─→ PhonemeRules (음소 규칙)
  ├─→ AudioContents (오디오)
  ├─→ UserProgresses (학습 진행)
  ├─→ Recordings (녹음)
  └─→ PronunciationEvaluations (발음 평가)

Units (단원)
  └─→ Words (단어 배열)
```

---

## 📈 현재 데이터 통계

| 컬렉션 | 문서 수 | 상태 |
|--------|---------|------|
| users | 3 | ✅ 활성 |
| words | 73 | ✅ 활성 |
| categories | 14 | ✅ 활성 |
| userprogresses | 3 | ✅ 활성 |
| recordings | 3 | ✅ 활성 |
| rankings | 4 | ✅ 활성 |
| phonemerules | 5 | ✅ 활성 |
| pronunciationevaluations | 0 | ⚪ 비어있음 |
| units | - | 🔍 확인 필요 |
| audiocontents | - | 🔍 확인 필요 |

---

## 🛠️ 데이터베이스 접속 방법

### Docker를 통한 MongoDB Shell 접속
```bash
# MongoDB Shell 접속
docker exec -it urimalzen-mongodb mongosh urimalzen

# 직접 명령어 실행
docker exec -it urimalzen-mongodb mongosh urimalzen --eval "db.users.find().pretty()"
```

### 주요 명령어
```javascript
// 데이터베이스 전환
use urimalzen

// 컬렉션 목록
show collections

// 데이터 조회
db.users.find().pretty()
db.words.find().limit(10)
db.categories.find()

// 통계
db.words.countDocuments()
db.users.countDocuments({ isAdmin: true })
```

---

## 📝 시드 데이터 명령어

프로젝트에는 다양한 시드 스크립트가 준비되어 있습니다:

```bash
cd backend

# 관리자 계정 생성
npm run seed:admin

# 카테고리 생성
npm run seed:categories

# 음소 규칙 생성
npm run seed:phoneme-rules

# KIIP 단어 생성
npm run seed:kiip-words

# 기본 단어 생성
npm run seed:basic-words

# 고급 단어 생성
npm run seed:advanced-words

# 꽃 관련 단어 마이그레이션
npm run migrate:flowers

# 모든 데이터 한 번에 생성
npm run seed:all
```

---

## 🔐 백업 및 복원

### 백업
```bash
# 전체 데이터베이스 백업
docker exec urimalzen-mongodb mongodump --db urimalzen --out /tmp/backup

# 백업 파일 복사
docker cp urimalzen-mongodb:/tmp/backup ./backup
```

### 복원
```bash
# 백업 파일을 컨테이너로 복사
docker cp ./backup urimalzen-mongodb:/tmp/backup

# 데이터베이스 복원
docker exec urimalzen-mongodb mongorestore --db urimalzen /tmp/backup/urimalzen
```

---

## 📚 참고사항

- **MongoDB 버전**: latest
- **포트**: 27017 (로컬 및 외부 접속 가능)
- **컨테이너명**: urimalzen-mongodb
- **인증**: 현재 인증 없음 (개발 환경)
- **백업 주기**: 수동 백업 필요

---

*이 문서는 자동으로 생성되었으며, 데이터베이스 구조 변경 시 업데이트가 필요합니다.*
