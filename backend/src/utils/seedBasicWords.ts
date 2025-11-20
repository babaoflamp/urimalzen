import mongoose from 'mongoose';
import Word from '../models/Word';
import dotenv from 'dotenv';

dotenv.config();

const basicWords = [
  // Level 0 - 인사 (Greetings)
  {
    koreanWord: '안녕하세요',
    mongolianWord: 'Сайн байна уу',
    imageUrl: '/images/words/hello.jpg',
    description: '사람을 만났을 때 하는 기본적인 인사말입니다.',
    pronunciation: 'an-nyeong-ha-se-yo',
    order: 10,
    examples: [
      { korean: '안녕하세요, 반갑습니다', mongolian: 'Сайн байна уу, танилцахад таатай байна' },
      { korean: '선생님, 안녕하세요', mongolian: 'Багш аа, сайн байна уу' }
    ],
    synonyms: ['안녕'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '인사',
    subCategory: '기본 인사',
    phonemeRules: [],
    standardPronunciation: '안녕하세요',
    difficultyScore: 10,
    wordType: 'other',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '안녕',
    mongolianWord: 'Сайн',
    imageUrl: '/images/words/hi.jpg',
    description: '친구나 가까운 사람에게 하는 인사말입니다.',
    pronunciation: 'an-nyeong',
    order: 11,
    examples: [
      { korean: '안녕, 잘 지냈어?', mongolian: 'Сайн, сайн байсан уу?' },
      { korean: '안녕, 또 보자', mongolian: 'Сайн, дахиад уулзъя' }
    ],
    synonyms: ['안녕하세요'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '인사',
    subCategory: '기본 인사',
    phonemeRules: [],
    standardPronunciation: '안녕',
    difficultyScore: 5,
    wordType: 'other',
    formalityLevel: 'informal'
  },
  {
    koreanWord: '감사합니다',
    mongolianWord: 'Баярлалаа',
    imageUrl: '/images/words/thankyou.jpg',
    description: '고마움을 표현할 때 사용하는 말입니다.',
    pronunciation: 'gam-sa-ham-ni-da',
    order: 12,
    examples: [
      { korean: '도와주셔서 감사합니다', mongolian: 'Тусалсанд баярлалаа' },
      { korean: '정말 감사합니다', mongolian: 'Үнэхээр баярлалаа' }
    ],
    synonyms: ['고맙습니다'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '인사',
    subCategory: '감사',
    phonemeRules: [],
    standardPronunciation: '감사함니다',
    difficultyScore: 15,
    wordType: 'other',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '죄송합니다',
    mongolianWord: 'Уучлаарай',
    imageUrl: '/images/words/sorry.jpg',
    description: '잘못했을 때 사과하는 말입니다.',
    pronunciation: 'joe-song-ham-ni-da',
    order: 13,
    examples: [
      { korean: '늦어서 죄송합니다', mongolian: 'Хоцорсонд уучлаарай' },
      { korean: '정말 죄송합니다', mongolian: 'Үнэхээр уучлаарай' }
    ],
    synonyms: ['미안합니다'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '인사',
    subCategory: '사과',
    phonemeRules: [],
    standardPronunciation: '죄송함니다',
    difficultyScore: 20,
    wordType: 'other',
    formalityLevel: 'formal'
  },

  // Level 0 - 자기소개 (Self-introduction)
  {
    koreanWord: '이름',
    mongolianWord: 'Нэр',
    imageUrl: '/images/words/name.jpg',
    description: '사람을 부르거나 구별하기 위한 말입니다.',
    pronunciation: 'i-reum',
    order: 14,
    examples: [
      { korean: '제 이름은 김철수입니다', mongolian: 'Миний нэр Ким Чөлсү' },
      { korean: '이름이 뭐예요?', mongolian: 'Нэр чинь юу вэ?' }
    ],
    synonyms: ['성명'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '자기소개',
    subCategory: '신상정보',
    phonemeRules: [],
    standardPronunciation: '이름',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '나이',
    mongolianWord: 'Нас',
    imageUrl: '/images/words/age.jpg',
    description: '태어난 후 지금까지 살아온 햇수입니다.',
    pronunciation: 'na-i',
    order: 15,
    examples: [
      { korean: '나이가 어떻게 되세요?', mongolian: 'Таны нас хэд вэ?' },
      { korean: '저는 스물다섯 살입니다', mongolian: 'Би хорин таван настай' }
    ],
    synonyms: ['연세'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '자기소개',
    subCategory: '신상정보',
    phonemeRules: [],
    standardPronunciation: '나이',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '국가',
    mongolianWord: 'Улс',
    imageUrl: '/images/words/country.jpg',
    description: '사람들이 사는 나라를 말합니다.',
    pronunciation: 'guk-ga',
    order: 16,
    examples: [
      { korean: '어느 국가에서 왔어요?', mongolian: 'Ямар улсаас ирсэн бэ?' },
      { korean: '저는 몽골에서 왔습니다', mongolian: 'Би Монголоос ирсэн' }
    ],
    synonyms: ['나라'],
    level: { kiip: 0, cefr: 'A1' },
    mainCategory: '자기소개',
    subCategory: '국적',
    phonemeRules: ['비음화'],
    standardPronunciation: '국까',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'formal'
  },

  // Level 1 - 음식 (Food)
  {
    koreanWord: '밥',
    mongolianWord: 'Будаа',
    imageUrl: '/images/words/rice.jpg',
    description: '쌀을 물에 넣어 익힌 음식입니다. 한국 사람들의 주식입니다.',
    pronunciation: 'bap',
    order: 17,
    examples: [
      { korean: '밥 먹었어요?', mongolian: 'Хоол идсэн үү?' },
      { korean: '저는 밥을 좋아합니다', mongolian: 'Би будаа дуртай' }
    ],
    synonyms: ['쌀밥', '식사'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '주식',
    phonemeRules: [],
    standardPronunciation: '밥',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '물',
    mongolianWord: 'Ус',
    imageUrl: '/images/words/water.jpg',
    description: '마시는 투명한 액체입니다.',
    pronunciation: 'mul',
    order: 18,
    examples: [
      { korean: '물 한 잔 주세요', mongolian: 'Ус нэг аяга өгөөч' },
      { korean: '물을 많이 마셔요', mongolian: 'Ус их уух' }
    ],
    synonyms: [],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '음료',
    phonemeRules: [],
    standardPronunciation: '물',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '김치',
    mongolianWord: 'Кимчи',
    imageUrl: '/images/words/kimchi.jpg',
    description: '배추를 소금과 고추로 담근 한국의 전통 음식입니다.',
    pronunciation: 'gim-chi',
    order: 19,
    examples: [
      { korean: '김치가 맵습니다', mongolian: 'Кимчи халуун' },
      { korean: '김치를 매일 먹어요', mongolian: 'Кимчи өдөр бүр идэх' }
    ],
    synonyms: [],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '반찬',
    phonemeRules: [],
    standardPronunciation: '김치',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '라면',
    mongolianWord: 'Рамён',
    imageUrl: '/images/words/ramen.jpg',
    description: '빠르게 끓여 먹는 면 요리입니다.',
    pronunciation: 'ra-myeon',
    order: 20,
    examples: [
      { korean: '라면이 먹고 싶어요', mongolian: 'Рамён идэхийг хүсэж байна' },
      { korean: '라면 끓일 줄 알아요?', mongolian: 'Рамён чанаж чадах уу?' }
    ],
    synonyms: ['instant noodles'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '주식',
    phonemeRules: [],
    standardPronunciation: '라면',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '빵',
    mongolianWord: 'Талх',
    imageUrl: '/images/words/bread.jpg',
    description: '밀가루로 만든 부드러운 음식입니다.',
    pronunciation: 'ppang',
    order: 21,
    examples: [
      { korean: '빵과 우유를 먹어요', mongolian: 'Талх, сүү идэх' },
      { korean: '이 빵이 맛있어요', mongolian: 'Энэ талх амттай' }
    ],
    synonyms: [],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '주식',
    phonemeRules: [],
    standardPronunciation: '빵',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 1 - 교통 (Transportation)
  {
    koreanWord: '버스',
    mongolianWord: 'Автобус',
    imageUrl: '/images/words/bus.jpg',
    description: '많은 사람이 함께 타는 큰 차입니다.',
    pronunciation: 'beo-seu',
    order: 22,
    examples: [
      { korean: '버스를 타고 학교에 가요', mongolian: 'Автобусаар сургууль явах' },
      { korean: '버스가 곧 옵니다', mongolian: 'Автобус удахгүй ирнэ' }
    ],
    synonyms: [],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '교통과 통신',
    subCategory: '대중교통',
    phonemeRules: [],
    standardPronunciation: '버스',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '지하철',
    mongolianWord: 'Метро',
    imageUrl: '/images/words/subway.jpg',
    description: '땅 밑으로 다니는 기차입니다.',
    pronunciation: 'ji-ha-cheol',
    order: 23,
    examples: [
      { korean: '지하철이 빠릅니다', mongolian: 'Метро хурдан' },
      { korean: '지하철역이 어디예요?', mongolian: 'Метроны буудал хаана вэ?' }
    ],
    synonyms: ['전철'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '교통과 통신',
    subCategory: '대중교통',
    phonemeRules: [],
    standardPronunciation: '지하철',
    difficultyScore: 20,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '택시',
    mongolianWord: 'Такси',
    imageUrl: '/images/words/taxi.jpg',
    description: '돈을 내고 타는 개인 차입니다.',
    pronunciation: 'taek-si',
    order: 24,
    examples: [
      { korean: '택시를 탈까요?', mongolian: 'Такси унах уу?' },
      { korean: '택시가 비쌉니다', mongolian: 'Такси үнэтэй' }
    ],
    synonyms: [],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '교통과 통신',
    subCategory: '대중교통',
    phonemeRules: [],
    standardPronunciation: '택씨',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 1 - 가족 (Family)
  {
    koreanWord: '가족',
    mongolianWord: 'Гэр бүл',
    imageUrl: '/images/words/family.jpg',
    description: '함께 사는 부모, 형제, 자매를 말합니다.',
    pronunciation: 'ga-jok',
    order: 25,
    examples: [
      { korean: '가족이 몇 명이에요?', mongolian: 'Гэр бүл хэдэн хүнтэй вэ?' },
      { korean: '가족과 함께 살아요', mongolian: 'Гэр бүлтэйгээ амьдрах' }
    ],
    synonyms: ['식구'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간',
    subCategory: '가족',
    phonemeRules: ['비음화'],
    standardPronunciation: '가족',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '어머니',
    mongolianWord: 'Ээж',
    imageUrl: '/images/words/mother.jpg',
    description: '나를 낳아 키워주신 여자 부모입니다.',
    pronunciation: 'eo-meo-ni',
    order: 26,
    examples: [
      { korean: '어머니가 요리를 잘 하세요', mongolian: 'Ээж хоол сайн хийдэг' },
      { korean: '어머니께 전화해요', mongolian: 'Ээж рүү утасдах' }
    ],
    synonyms: ['엄마', '모친'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간',
    subCategory: '가족',
    phonemeRules: [],
    standardPronunciation: '어머니',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '아버지',
    mongolianWord: 'Аав',
    imageUrl: '/images/words/father.jpg',
    description: '나를 낳아 키워주신 남자 부모입니다.',
    pronunciation: 'a-beo-ji',
    order: 27,
    examples: [
      { korean: '아버지는 회사에 다니세요', mongolian: 'Аав компанид явдаг' },
      { korean: '아버지와 산책해요', mongolian: 'Аавтай алхах' }
    ],
    synonyms: ['아빠', '부친'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간',
    subCategory: '가족',
    phonemeRules: [],
    standardPronunciation: '아버지',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'formal'
  },

  // Level 1 - 주생활 (Housing)
  {
    koreanWord: '집',
    mongolianWord: 'Гэр',
    imageUrl: '/images/words/house.jpg',
    description: '사람이 사는 건물입니다.',
    pronunciation: 'jip',
    order: 28,
    examples: [
      { korean: '집에 가요', mongolian: 'Гэр явах' },
      { korean: '집이 크고 좋아요', mongolian: 'Гэр том, сайхан' }
    ],
    synonyms: ['주택', '가정'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '주생활',
    subCategory: '주거',
    phonemeRules: [],
    standardPronunciation: '집',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '방',
    mongolianWord: 'Өрөө',
    imageUrl: '/images/words/room.jpg',
    description: '집 안의 작은 공간입니다.',
    pronunciation: 'bang',
    order: 29,
    examples: [
      { korean: '내 방은 2층에 있어요', mongolian: 'Миний өрөө 2 давхарт байна' },
      { korean: '방을 청소해요', mongolian: 'Өрөө цэвэрлэх' }
    ],
    synonyms: ['실'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '주생활',
    subCategory: '주거',
    phonemeRules: [],
    standardPronunciation: '방',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 2 - 일상생활
  {
    koreanWord: '학교',
    mongolianWord: 'Сургууль',
    imageUrl: '/images/words/school.jpg',
    description: '공부하는 곳입니다.',
    pronunciation: 'hak-gyo',
    order: 30,
    examples: [
      { korean: '학교에 갑니다', mongolian: 'Сургууль явах' },
      { korean: '학교가 재미있어요', mongolian: 'Сургууль сонирхолтой' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '교육',
    subCategory: '교육기관',
    phonemeRules: ['비음화'],
    standardPronunciation: '학꾜',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '회사',
    mongolianWord: 'Компани',
    imageUrl: '/images/words/company.jpg',
    description: '일하는 곳입니다.',
    pronunciation: 'hoe-sa',
    order: 31,
    examples: [
      { korean: '회사에 다녀요', mongolian: 'Компанид явдаг' },
      { korean: '회사 일이 많아요', mongolian: 'Компанийн ажил их' }
    ],
    synonyms: ['직장'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '직업과 일',
    subCategory: '직장',
    phonemeRules: [],
    standardPronunciation: '회사',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '병원',
    mongolianWord: 'Эмнэлэг',
    imageUrl: '/images/words/hospital.jpg',
    description: '아플 때 가는 곳입니다.',
    pronunciation: 'byeong-won',
    order: 32,
    examples: [
      { korean: '병원에 가야 해요', mongolian: 'Эмнэлэг явах хэрэгтэй' },
      { korean: '병원에서 치료받아요', mongolian: 'Эмнэлэгт эмчлүүлэх' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '건강과 안전',
    subCategory: '의료',
    phonemeRules: [],
    standardPronunciation: '병원',
    difficultyScore: 20,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '시장',
    mongolianWord: 'Зах',
    imageUrl: '/images/words/market.jpg',
    description: '물건을 사고 파는 곳입니다.',
    pronunciation: 'si-jang',
    order: 33,
    examples: [
      { korean: '시장에서 장을 봐요', mongolian: 'Захаас бараа худалдаж авах' },
      { korean: '시장이 붐빕니다', mongolian: 'Зах хүмүүсээр дүүрэн' }
    ],
    synonyms: ['장터'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '경제 생활',
    subCategory: '쇼핑',
    phonemeRules: [],
    standardPronunciation: '시장',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 2 - 시간
  {
    koreanWord: '오늘',
    mongolianWord: 'Өнөөдөр',
    imageUrl: '/images/words/today.jpg',
    description: '지금 이 날입니다.',
    pronunciation: 'o-neul',
    order: 34,
    examples: [
      { korean: '오늘은 날씨가 좋아요', mongolian: 'Өнөөдөр цаг агаар сайхан' },
      { korean: '오늘 뭐 해요?', mongolian: 'Өнөөдөр юу хийх вэ?' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '시간',
    phonemeRules: [],
    standardPronunciation: '오늘',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '내일',
    mongolianWord: 'Маргааш',
    imageUrl: '/images/words/tomorrow.jpg',
    description: '오늘 다음 날입니다.',
    pronunciation: 'nae-il',
    order: 35,
    examples: [
      { korean: '내일 만나요', mongolian: 'Маргааш уулзая' },
      { korean: '내일은 휴일입니다', mongolian: 'Маргааш амралтын өдөр' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '시간',
    phonemeRules: [],
    standardPronunciation: '내일',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '어제',
    mongolianWord: 'Өчигдөр',
    imageUrl: '/images/words/yesterday.jpg',
    description: '오늘 이전 날입니다.',
    pronunciation: 'eo-je',
    order: 36,
    examples: [
      { korean: '어제 영화 봤어요', mongolian: 'Өчигдөр кино үзсэн' },
      { korean: '어제는 비가 왔어요', mongolian: 'Өчигдөр бороо орсон' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '시간',
    phonemeRules: [],
    standardPronunciation: '어제',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 2 - 날씨
  {
    koreanWord: '날씨',
    mongolianWord: 'Цаг агаар',
    imageUrl: '/images/words/weather.jpg',
    description: '하늘의 상태입니다.',
    pronunciation: 'nal-ssi',
    order: 37,
    examples: [
      { korean: '오늘 날씨가 좋아요', mongolian: 'Өнөөдөр цаг агаар сайхан' },
      { korean: '날씨가 추워요', mongolian: 'Цаг агаар хүйтэн' }
    ],
    synonyms: ['기상'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '자연과 환경',
    subCategory: '날씨',
    phonemeRules: [],
    standardPronunciation: '날씨',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '비',
    mongolianWord: 'Бороо',
    imageUrl: '/images/words/rain.jpg',
    description: '하늘에서 내리는 물입니다.',
    pronunciation: 'bi',
    order: 38,
    examples: [
      { korean: '비가 와요', mongolian: 'Бороо орж байна' },
      { korean: '비가 많이 내려요', mongolian: 'Бороо их орж байна' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '자연과 환경',
    subCategory: '날씨',
    phonemeRules: [],
    standardPronunciation: '비',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '눈',
    mongolianWord: 'Цас',
    imageUrl: '/images/words/snow.jpg',
    description: '겨울에 하늘에서 내리는 하얀 것입니다.',
    pronunciation: 'nun',
    order: 39,
    examples: [
      { korean: '눈이 내려요', mongolian: 'Цас орж байна' },
      { korean: '눈이 많이 쌓였어요', mongolian: 'Цас их хуримтлагдсан' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '자연과 환경',
    subCategory: '날씨',
    phonemeRules: [],
    standardPronunciation: '눈',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '바람',
    mongolianWord: 'Салхи',
    imageUrl: '/images/words/wind.jpg',
    description: '공기가 움직이는 것입니다.',
    pronunciation: 'ba-ram',
    order: 40,
    examples: [
      { korean: '바람이 불어요', mongolian: 'Салхи үлээж байна' },
      { korean: '바람이 세요', mongolian: 'Салхи хүчтэй' }
    ],
    synonyms: [],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '자연과 환경',
    subCategory: '날씨',
    phonemeRules: [],
    standardPronunciation: '바람',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },

  // Level 2 - 숫자 (기본)
  {
    koreanWord: '하나',
    mongolianWord: 'Нэг',
    imageUrl: '/images/words/one.jpg',
    description: '1을 나타내는 한국어 고유 숫자입니다.',
    pronunciation: 'ha-na',
    order: 41,
    examples: [
      { korean: '사과 하나 주세요', mongolian: 'Алим нэг өгөөч' },
      { korean: '하나, 둘, 셋', mongolian: 'Нэг, хоёр, гурав' }
    ],
    synonyms: ['일'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '수',
    phonemeRules: [],
    standardPronunciation: '하나',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '둘',
    mongolianWord: 'Хоёр',
    imageUrl: '/images/words/two.jpg',
    description: '2를 나타내는 한국어 고유 숫자입니다.',
    pronunciation: 'dul',
    order: 42,
    examples: [
      { korean: '사람이 둘이에요', mongolian: 'Хүн хоёр байна' },
      { korean: '둘 다 좋아요', mongolian: 'Хоёулаа сайн' }
    ],
    synonyms: ['이'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '수',
    phonemeRules: [],
    standardPronunciation: '둘',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  },
  {
    koreanWord: '셋',
    mongolianWord: 'Гурав',
    imageUrl: '/images/words/three.jpg',
    description: '3을 나타내는 한국어 고유 숫자입니다.',
    pronunciation: 'set',
    order: 43,
    examples: [
      { korean: '의자가 셋 있어요', mongolian: 'Сандал гурав байна' },
      { korean: '셋이서 가요', mongolian: 'Гурваар явах' }
    ],
    synonyms: ['삼'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '일상생활',
    subCategory: '수',
    phonemeRules: [],
    standardPronunciation: '셋',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral'
  }
];

const seedBasicWords = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Insert new words (keep existing flower words)
    await Word.insertMany(basicWords);
    console.log(`${basicWords.length} basic words seeded successfully`);
    
    // Show summary
    const level0Count = basicWords.filter(w => w.level.kiip === 0).length;
    const level1Count = basicWords.filter(w => w.level.kiip === 1).length;
    const level2Count = basicWords.filter(w => w.level.kiip === 2).length;
    
    console.log('\n📊 Summary:');
    console.log(`Level 0 (입문): ${level0Count}개`);
    console.log(`Level 1 (초급1): ${level1Count}개`);
    console.log(`Level 2 (초급2): ${level2Count}개`);
    console.log(`Total: ${basicWords.length}개`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedBasicWords();
