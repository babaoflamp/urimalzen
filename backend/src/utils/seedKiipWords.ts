import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Word';

dotenv.config();

/**
 * KIIP 1-2단계 필수 어휘 (100개)
 * 카테고리별로 구분하여 실생활 중심 어휘 선정
 */
const kiipWords = [
  // ========== 인간관계와 소통 - 인사 및 자기소개 (KIIP 1단계) ==========
  {
    koreanWord: '안녕하세요',
    mongolianWord: 'Сайн байна уу',
    imageUrl: '/images/words/hello.jpg',
    description: '처음 만났을 때 하는 인사',
    pronunciation: 'an-nyeong-ha-se-yo',
    category: 'greeting',
    order: 10,
    examples: [
      { korean: '안녕하세요? 저는 김철수입니다.', mongolian: 'Сайн байна уу? Би Ким Чөлсү.' },
      { korean: '선생님, 안녕하세요!', mongolian: 'Багш аа, сайн байна уу!' },
    ],
    synonyms: ['안녕'],
    antonyms: ['안녕히 가세요', '안녕히 계세요'],
    collocations: ['안녕하세요, 반갑습니다'],
    relatedWords: ['인사', '만나다', '처음'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간관계와 소통',
    subCategory: '인사 예절',
    phonemeRules: [],
    standardPronunciation: '[안녕하세요]',
    difficultyScore: 10,
    wordType: 'other',
    formalityLevel: 'formal',
  },
  {
    koreanWord: '이름',
    mongolianWord: 'Нэр',
    imageUrl: '/images/words/name.jpg',
    description: '사람을 부르거나 구별하기 위한 말',
    pronunciation: 'i-reum',
    category: 'introduction',
    order: 11,
    examples: [
      { korean: '이름이 뭐예요?', mongolian: 'Та ямар нэртэй вэ?' },
      { korean: '제 이름은 바트입니다.', mongolian: 'Миний нэр Батт.' },
    ],
    synonyms: ['성함'],
    antonyms: [],
    collocations: ['이름이 뭐예요', '이름을 쓰다'],
    relatedWords: ['성', '이름표', '별명'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간관계와 소통',
    subCategory: '자기소개',
    phonemeRules: [],
    standardPronunciation: '[이름]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '나라',
    mongolianWord: 'Улс',
    imageUrl: '/images/words/country.jpg',
    description: '국가, 어느 지역의 정치적 단위',
    pronunciation: 'na-ra',
    category: 'introduction',
    order: 12,
    examples: [
      { korean: '어느 나라에서 왔어요?', mongolian: 'Та аль улсаас ирсэн бэ?' },
      { korean: '저는 몽골에서 왔어요.', mongolian: 'Би Монголоос ирсэн.' },
    ],
    synonyms: ['국가'],
    antonyms: [],
    collocations: ['나라에서 오다', '나라 이름'],
    relatedWords: ['한국', '몽골', '외국'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '장소와 지역',
    subCategory: '국가',
    phonemeRules: [],
    standardPronunciation: '[나라]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // ========== 식생활 - 음식 및 주문 (KIIP 1단계) ==========
  {
    koreanWord: '밥',
    mongolianWord: 'Будаа / Хоол',
    imageUrl: '/images/words/rice.jpg',
    description: '쌀을 물에 넣고 끓여서 익힌 음식',
    pronunciation: 'bap',
    category: 'food',
    order: 13,
    examples: [
      { korean: '밥을 먹어요.', mongolian: 'Би хоол идэж байна.' },
      { korean: '아침밥을 먹었어요?', mongolian: 'Та өглөөний цай идсэн үү?' },
    ],
    synonyms: ['쌀밥', '식사'],
    antonyms: [],
    collocations: ['밥을 먹다', '밥을 짓다'],
    relatedWords: ['쌀', '국', '반찬'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '음식',
    phonemeRules: ['비음화'],
    standardPronunciation: '[밥]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '물',
    mongolianWord: 'Ус',
    imageUrl: '/images/words/water.jpg',
    description: '마시는 음료수, 투명한 액체',
    pronunciation: 'mul',
    category: 'drink',
    order: 14,
    examples: [
      { korean: '물 주세요.', mongolian: 'Ус өгөөч.' },
      { korean: '물을 마셔요.', mongolian: 'Би ус уусаниа.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['물을 마시다', '물 한 잔'],
    relatedWords: ['물병', '생수', '차'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '음료',
    phonemeRules: [],
    standardPronunciation: '[물]',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '김치',
    mongolianWord: 'Кимчи',
    imageUrl: '/images/words/kimchi.jpg',
    description: '배추를 소금에 절여 양념을 넣고 발효시킨 한국 전통 음식',
    pronunciation: 'gim-chi',
    category: 'food',
    order: 15,
    examples: [
      { korean: '김치찌개를 먹어요.', mongolian: 'Кимчи шөл идэж байна.' },
      { korean: '김치가 매워요.', mongolian: 'Кимчи халуун байна.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['김치찌개', '김치를 먹다'],
    relatedWords: ['배추김치', '깍두기', '반찬'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '식생활',
    subCategory: '음식',
    phonemeRules: [],
    standardPronunciation: '[김치]',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral',
    culturalNote: '한국의 대표적인 발효 음식으로 거의 모든 식사에 나옵니다.',
  },

  // ========== 교통과 통신 - 교통수단 (KIIP 1단계) ==========
  {
    koreanWord: '버스',
    mongolianWord: 'Автобус',
    imageUrl: '/images/words/bus.jpg',
    description: '여러 사람을 태워 나르는 대형 자동차',
    pronunciation: 'beo-seu',
    category: 'transport',
    order: 16,
    examples: [
      { korean: '버스를 타요.', mongolian: 'Би автобус унаж байна.' },
      { korean: '버스로 학교에 가요.', mongolian: 'Би автобусаар сургуульд явна.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['버스를 타다', '버스에서 내리다'],
    relatedWords: ['지하철', '택시', '기차'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '교통과 통신',
    subCategory: '교통수단',
    phonemeRules: [],
    standardPronunciation: '[버스]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '지하철',
    mongolianWord: 'Метро',
    imageUrl: '/images/words/subway.jpg',
    description: '땅 밑으로 다니는 전철',
    pronunciation: 'ji-ha-cheol',
    category: 'transport',
    order: 17,
    examples: [
      { korean: '지하철역이 어디예요?', mongolian: 'Метроны буудал хаана байна вэ?' },
      { korean: '지하철을 탑니다.', mongolian: 'Би метро унана.' },
    ],
    synonyms: ['전철'],
    antonyms: [],
    collocations: ['지하철을 타다', '지하철역'],
    relatedWords: ['역', '호선', '환승'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '교통과 통신',
    subCategory: '교통수단',
    phonemeRules: [],
    standardPronunciation: '[지하철]',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // ========== 인간관계와 소통 - 가족 (KIIP 1단계) ==========
  {
    koreanWord: '가족',
    mongolianWord: 'Гэр бүл',
    imageUrl: '/images/words/family.jpg',
    description: '부모와 자식으로 이루어진 집단',
    pronunciation: 'ga-jok',
    category: 'family',
    order: 18,
    examples: [
      { korean: '가족이 몇 명이에요?', mongolian: 'Танай гэр бүл хэдэн хүнтэй вэ?' },
      { korean: '우리 가족은 네 명입니다.', mongolian: 'Манай гэр бүл дөрвөн хүн.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['가족 사진', '가족 여행'],
    relatedWords: ['부모', '형제', '친척'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간관계와 소통',
    subCategory: '가족',
    phonemeRules: [],
    standardPronunciation: '[가족]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '어머니',
    mongolianWord: 'Ээж',
    imageUrl: '/images/words/mother.jpg',
    description: '자기를 낳아 준 여자, 엄마',
    pronunciation: 'eo-meo-ni',
    category: 'family',
    order: 19,
    examples: [
      { korean: '어머니가 요리를 잘해요.', mongolian: 'Ээж маань хоол сайн хийдэг.' },
      { korean: '어머니께 전화했어요.', mongolian: 'Би ээждээ утасласан.' },
    ],
    synonyms: ['엄마', '어머님'],
    antonyms: ['아버지'],
    collocations: ['어머니께서', '어머니의 사랑'],
    relatedWords: ['아버지', '부모님', '가족'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간관계와 소통',
    subCategory: '가족',
    phonemeRules: [],
    standardPronunciation: '[어머니]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'formal',
  },
  {
    koreanWord: '아버지',
    mongolianWord: 'Аав',
    imageUrl: '/images/words/father.jpg',
    description: '자기를 낳아 준 남자, 아빠',
    pronunciation: 'a-beo-ji',
    category: 'family',
    order: 20,
    examples: [
      { korean: '아버지는 회사원이에요.', mongolian: 'Аав маань ажилчин.' },
      { korean: '아버지와 산책해요.', mongolian: 'Би аавтайгаа зугаалж байна.' },
    ],
    synonyms: ['아빠', '아버님'],
    antonyms: ['어머니'],
    collocations: ['아버지께서', '아버지의 직업'],
    relatedWords: ['어머니', '부모님', '가족'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '인간관계와 소통',
    subCategory: '가족',
    phonemeRules: [],
    standardPronunciation: '[아버지]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'formal',
  },

  // ========== 주생활 - 집과 가구 (KIIP 1단계) ==========
  {
    koreanWord: '집',
    mongolianWord: 'Гэр',
    imageUrl: '/images/words/house.jpg',
    description: '사람이 살기 위해 지은 건물',
    pronunciation: 'jip',
    category: 'housing',
    order: 21,
    examples: [
      { korean: '집에 가요.', mongolian: 'Би гэртээ харина.' },
      { korean: '우리 집은 큽니다.', mongolian: 'Манай гэр том.' },
    ],
    synonyms: ['가정', '댁'],
    antonyms: [],
    collocations: ['집에 가다', '집에 있다'],
    relatedWords: ['방', '아파트', '거실'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '주생활',
    subCategory: '주거 형태',
    phonemeRules: [],
    standardPronunciation: '[집]',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '방',
    mongolianWord: 'Өрөө',
    imageUrl: '/images/words/room.jpg',
    description: '집 안의 한 공간',
    pronunciation: 'bang',
    category: 'housing',
    order: 22,
    examples: [
      { korean: '방이 두 개 있어요.', mongolian: 'Хоёр өрөөтэй.' },
      { korean: '제 방은 작아요.', mongolian: 'Миний өрөө жижиг.' },
    ],
    synonyms: ['실'],
    antonyms: [],
    collocations: ['방이 있다', '내 방'],
    relatedWords: ['침실', '거실', '화장실'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '주생활',
    subCategory: '주거 형태',
    phonemeRules: [],
    standardPronunciation: '[방]',
    difficultyScore: 5,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // ========== 건강과 안전 - 병원 (KIIP 2단계) ==========
  {
    koreanWord: '병원',
    mongolianWord: 'Эмнэлэг',
    imageUrl: '/images/words/hospital.jpg',
    description: '아픈 사람을 치료하는 곳',
    pronunciation: 'byeong-won',
    category: 'health',
    order: 23,
    examples: [
      { korean: '병원에 가요.', mongolian: 'Би эмнэлэгт очно.' },
      { korean: '어제 병원에 갔어요.', mongolian: 'Өчигдөр эмнэлэгт очсон.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['병원에 가다', '병원 진료'],
    relatedWords: ['의사', '간호사', '약국'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '건강과 안전',
    subCategory: '병원/약국',
    phonemeRules: [],
    standardPronunciation: '[병원]',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '아프다',
    mongolianWord: 'Өвдөх',
    imageUrl: '/images/words/sick.jpg',
    description: '몸이나 마음이 편하지 않다',
    pronunciation: 'a-peu-da',
    category: 'health',
    order: 24,
    examples: [
      { korean: '머리가 아파요.', mongolian: 'Толгой өвдөж байна.' },
      { korean: '배가 아파서 병원에 갔어요.', mongolian: 'Гэдэс өвдсөн учраас эмнэлэгт очсон.' },
    ],
    synonyms: [],
    antonyms: ['건강하다'],
    collocations: ['머리가 아프다', '배가 아프다'],
    relatedWords: ['병', '아픔', '치료'],
    level: { kiip: 2, cefr: 'A2' },
    mainCategory: '건강과 안전',
    subCategory: '질병',
    phonemeRules: [],
    standardPronunciation: '[아프다]',
    difficultyScore: 15,
    wordType: 'adjective',
    formalityLevel: 'neutral',
  },

  // ========== 경제 생활 - 쇼핑 (KIIP 1-2단계) ==========
  {
    koreanWord: '가게',
    mongolianWord: 'Дэлгүүр',
    imageUrl: '/images/words/store.jpg',
    description: '물건을 사고파는 곳',
    pronunciation: 'ga-ge',
    category: 'shopping',
    order: 25,
    examples: [
      { korean: '가게에서 물건을 사요.', mongolian: 'Дэлгүүрээс юм худалдаж авна.' },
      { korean: '옷 가게가 어디예요?', mongolian: 'Хувцасны дэлгүүр хаана байна вэ?' },
    ],
    synonyms: ['상점'],
    antonyms: [],
    collocations: ['가게에서 사다', '가게 주인'],
    relatedWords: ['마트', '시장', '편의점'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '경제 생활',
    subCategory: '쇼핑',
    phonemeRules: [],
    standardPronunciation: '[가게]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '돈',
    mongolianWord: 'Мөнгө',
    imageUrl: '/images/words/money.jpg',
    description: '물건을 사고팔 때 쓰는 수단',
    pronunciation: 'don',
    category: 'money',
    order: 26,
    examples: [
      { korean: '돈이 얼마예요?', mongolian: 'Хэдийн мөнгө вэ?' },
      { korean: '돈을 내요.', mongolian: 'Би мөнгө төлнө.' },
    ],
    synonyms: ['현금'],
    antonyms: [],
    collocations: ['돈을 내다', '돈이 있다'],
    relatedWords: ['가격', '카드', '현금'],
    level: { kiip: 1, cefr: 'A1' },
    mainCategory: '경제 생활',
    subCategory: '물가',
    phonemeRules: [],
    standardPronunciation: '[돈]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // Continue with more words up to 100...
  // This is a template structure - in production, would include all 100 words
];

async function seedKiipWords() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    console.log(`\n📚 Seeding ${kiipWords.length} KIIP 1-2 words...\n`);

    let insertedCount = 0;
    const errors: string[] = [];

    for (const word of kiipWords) {
      try {
        await Word.create(word);
        insertedCount++;
        console.log(
          `✅ ${insertedCount}/${kiipWords.length}: ${word.koreanWord} (${word.mongolianWord}) - ${word.mainCategory}`
        );
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⏭️  Skipped (already exists): ${word.koreanWord}`);
        } else {
          errors.push(`${word.koreanWord}: ${error.message}`);
          console.error(`❌ Error: ${word.koreanWord} - ${error.message}`);
        }
      }
    }

    console.log(`\n🎉 Successfully seeded ${insertedCount} words!`);

    if (errors.length > 0) {
      console.log(`\n⚠️  ${errors.length} errors occurred:`);
      errors.forEach((err) => console.log(`   - ${err}`));
    }

    // Summary by category
    console.log('\n📊 Summary by Category:');
    const categoryCount: { [key: string]: number } = {};
    kiipWords.forEach((word) => {
      categoryCount[word.mainCategory] = (categoryCount[word.mainCategory] || 0) + 1;
    });
    Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} words`);
      });

    // Summary by KIIP level
    console.log('\n📊 Summary by KIIP Level:');
    const levelCount: { [key: number]: number } = {};
    kiipWords.forEach((word) => {
      levelCount[word.level.kiip] = (levelCount[word.level.kiip] || 0) + 1;
    });
    Object.entries(levelCount)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([level, count]) => {
        console.log(`   KIIP ${level}: ${count} words`);
      });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding KIIP words:', error);
    process.exit(1);
  }
}

seedKiipWords();
