import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Word';

dotenv.config();

/**
 * TOPIK 1-2급 필수 어휘 (50개)
 * 시험 영역별(듣기, 읽기, 쓰기)로 구분하여 선정
 */
const topikWords = [
  // ========== TOPIK 1급 - 듣기 영역 ==========
  {
    koreanWord: '학교',
    mongolianWord: 'Сургууль',
    imageUrl: '/images/words/school.jpg',
    description: '학생들이 공부하는 곳',
    pronunciation: 'hak-gyo',
    category: 'education',
    order: 1000,
    examples: [
      { korean: '저는 학교에 갑니다.', mongolian: 'Би сургууль явна.' },
      { korean: '학교가 어디에 있어요?', mongolian: 'Сургууль хаана байдаг вэ?' },
    ],
    synonyms: ['학원'],
    antonyms: [],
    collocations: ['학교에 가다', '학교를 다니다'],
    relatedWords: ['학생', '선생님', '공부'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'listening',
    mainCategory: '교육 생활',
    subCategory: '학교',
    phonemeRules: [],
    standardPronunciation: '[학교]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '친구',
    mongolianWord: 'Найз',
    imageUrl: '/images/words/friend.jpg',
    description: '가까이 지내는 사람',
    pronunciation: 'chin-gu',
    category: 'relationship',
    order: 1001,
    examples: [
      { korean: '친구를 만나요.', mongolian: 'Найзтайгаа уулзана.' },
      { korean: '제 친구는 한국 사람이에요.', mongolian: 'Миний найз солонгос хүн.' },
    ],
    synonyms: [],
    antonyms: ['적', '원수'],
    collocations: ['친구를 만나다', '친구가 되다'],
    relatedWords: ['동료', '동무', '친하다'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'listening',
    mainCategory: '인간관계와 소통',
    subCategory: '인간관계',
    phonemeRules: [],
    standardPronunciation: '[친구]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '가다',
    mongolianWord: 'Явах',
    imageUrl: '/images/words/go.jpg',
    description: '한 곳에서 다른 곳으로 이동하다',
    pronunciation: 'ga-da',
    category: 'movement',
    order: 1002,
    examples: [
      { korean: '집에 가요.', mongolian: 'Гэр рүү явна.' },
      { korean: '어디 가세요?', mongolian: 'Та хаашаа явах вэ?' },
    ],
    synonyms: [],
    antonyms: ['오다'],
    collocations: ['학교에 가다', '집에 가다'],
    relatedWords: ['오다', '걷다', '이동하다'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'listening',
    mainCategory: '동작과 상태',
    subCategory: '이동',
    phonemeRules: [],
    standardPronunciation: '[가다]',
    difficultyScore: 10,
    wordType: 'verb',
    formalityLevel: 'neutral',
  },

  // ========== TOPIK 1급 - 읽기 영역 ==========
  {
    koreanWord: '책',
    mongolianWord: 'Ном',
    imageUrl: '/images/words/book.jpg',
    description: '글과 그림이 인쇄된 종이를 묶은 것',
    pronunciation: 'chaek',
    category: 'education',
    order: 1003,
    examples: [
      { korean: '책을 읽어요.', mongolian: 'Ном уншина.' },
      { korean: '이 책은 재미있어요.', mongolian: 'Энэ ном сонирхолтой.' },
    ],
    synonyms: ['서적'],
    antonyms: [],
    collocations: ['책을 읽다', '책을 사다'],
    relatedWords: ['도서관', '독서', '공부'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'reading',
    mainCategory: '교육 생활',
    subCategory: '학습 도구',
    phonemeRules: [],
    standardPronunciation: '[책]',
    difficultyScore: 10,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '시간',
    mongolianWord: 'Цаг',
    imageUrl: '/images/words/time.jpg',
    description: '시각이나 시간의 길이',
    pronunciation: 'si-gan',
    category: 'time',
    order: 1004,
    examples: [
      { korean: '지금 몇 시예요?', mongolian: 'Одоо хэдэн цаг вэ?' },
      { korean: '시간이 없어요.', mongolian: 'Цаг алга.' },
    ],
    synonyms: ['때'],
    antonyms: [],
    collocations: ['시간이 있다', '시간을 보내다'],
    relatedWords: ['분', '초', '시계'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'reading',
    mainCategory: '시간과 날짜',
    subCategory: '시간',
    phonemeRules: [],
    standardPronunciation: '[시간]',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '많다',
    mongolianWord: 'Олон',
    imageUrl: '/images/words/many.jpg',
    description: '수나 양이 일정한 정도를 넘다',
    pronunciation: 'man-ta',
    category: 'quantity',
    order: 1005,
    examples: [
      { korean: '사람이 많아요.', mongolian: 'Хүн олон байна.' },
      { korean: '돈이 많지 않아요.', mongolian: 'Мөнгө их биш.' },
    ],
    synonyms: [],
    antonyms: ['적다'],
    collocations: ['사람이 많다', '시간이 많다'],
    relatedWords: ['적다', '수량', '양'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'reading',
    mainCategory: '수량과 정도',
    subCategory: '수량',
    phonemeRules: [],
    standardPronunciation: '[만타]',
    difficultyScore: 15,
    wordType: 'adjective',
    formalityLevel: 'neutral',
  },

  // ========== TOPIK 1급 - 쓰기 영역 ==========
  {
    koreanWord: '쓰다',
    mongolianWord: 'Бичих',
    imageUrl: '/images/words/write.jpg',
    description: '글자나 문장을 적다',
    pronunciation: 'sseu-da',
    category: 'action',
    order: 1006,
    examples: [
      { korean: '편지를 써요.', mongolian: 'Захидал бичнэ.' },
      { korean: '이름을 쓰세요.', mongolian: 'Нэрээ бичнэ үү.' },
    ],
    synonyms: ['적다'],
    antonyms: ['읽다'],
    collocations: ['편지를 쓰다', '글을 쓰다'],
    relatedWords: ['글', '펜', '종이'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'writing',
    mainCategory: '동작과 상태',
    subCategory: '학습 활동',
    phonemeRules: [],
    standardPronunciation: '[쓰다]',
    difficultyScore: 15,
    wordType: 'verb',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '날씨',
    mongolianWord: 'Цаг агаар',
    imageUrl: '/images/words/weather.jpg',
    description: '비, 바람, 온도 등의 기상 상태',
    pronunciation: 'nal-ssi',
    category: 'weather',
    order: 1007,
    examples: [
      { korean: '오늘 날씨가 좋아요.', mongolian: 'Өнөөдөр цаг агаар сайхан байна.' },
      { korean: '날씨가 어때요?', mongolian: 'Цаг агаар ямар байна?' },
    ],
    synonyms: ['기상', '기후'],
    antonyms: [],
    collocations: ['날씨가 좋다', '날씨가 나쁘다'],
    relatedWords: ['비', '눈', '바람'],
    programType: 'topik',
    level: { topik: 1, cefr: 'A1' },
    testSection: 'writing',
    mainCategory: '자연과 환경',
    subCategory: '날씨',
    phonemeRules: [],
    standardPronunciation: '[날씨]',
    difficultyScore: 15,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // ========== TOPIK 2급 - 듣기 영역 ==========
  {
    koreanWord: '약속',
    mongolianWord: 'Амлалт',
    imageUrl: '/images/words/promise.jpg',
    description: '앞으로 어떤 일을 하기로 미리 정함',
    pronunciation: 'yak-sok',
    category: 'social',
    order: 1008,
    examples: [
      { korean: '친구와 약속이 있어요.', mongolian: 'Найзтайгаа амлалт байна.' },
      { korean: '약속 시간을 잘 지켜요.', mongolian: 'Амлалтын цагаа сайн дагаж мөрдөнө.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['약속을 하다', '약속을 지키다'],
    relatedWords: ['만나다', '시간', '계획'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'listening',
    mainCategory: '인간관계와 소통',
    subCategory: '사회생활',
    phonemeRules: [],
    standardPronunciation: '[약속]',
    difficultyScore: 25,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '준비하다',
    mongolianWord: 'Бэлтгэх',
    imageUrl: '/images/words/prepare.jpg',
    description: '미리 마련하여 갖추다',
    pronunciation: 'jun-bi-ha-da',
    category: 'action',
    order: 1009,
    examples: [
      { korean: '시험을 준비해요.', mongolian: 'Шалгалт бэлтгэж байна.' },
      { korean: '여행 준비를 했어요?', mongolian: 'Аялал бэлтгэсэн үү?' },
    ],
    synonyms: ['갖추다', '마련하다'],
    antonyms: [],
    collocations: ['준비를 하다', '준비가 되다'],
    relatedWords: ['계획', '시작', '미리'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'listening',
    mainCategory: '동작과 상태',
    subCategory: '계획',
    phonemeRules: [],
    standardPronunciation: '[준비하다]',
    difficultyScore: 30,
    wordType: 'verb',
    formalityLevel: 'neutral',
  },

  // ========== TOPIK 2급 - 읽기 영역 ==========
  {
    koreanWord: '건강',
    mongolianWord: 'Эрүүл мэнд',
    imageUrl: '/images/words/health.jpg',
    description: '몸과 마음이 튼튼한 상태',
    pronunciation: 'geon-gang',
    category: 'health',
    order: 1010,
    examples: [
      { korean: '건강이 좋아요.', mongolian: 'Эрүүл мэнд сайн байна.' },
      { korean: '건강을 위해 운동해요.', mongolian: 'Эрүүл мэндийн төлөө дасгал хийнэ.' },
    ],
    synonyms: [],
    antonyms: ['질병', '병'],
    collocations: ['건강이 좋다', '건강을 지키다'],
    relatedWords: ['병원', '운동', '음식'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'reading',
    mainCategory: '건강과 생활',
    subCategory: '건강',
    phonemeRules: [],
    standardPronunciation: '[건강]',
    difficultyScore: 25,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
  {
    koreanWord: '경험',
    mongolianWord: 'Туршлага',
    imageUrl: '/images/words/experience.jpg',
    description: '어떤 일을 직접 겪거나 해 본 일',
    pronunciation: 'gyeong-heom',
    category: 'abstract',
    order: 1011,
    examples: [
      { korean: '한국 생활 경험이 있어요.', mongolian: 'Солонгост амьдрах туршлагатай.' },
      { korean: '좋은 경험이었어요.', mongolian: 'Сайн туршлага байсан.' },
    ],
    synonyms: ['체험'],
    antonyms: [],
    collocations: ['경험이 있다', '경험을 하다'],
    relatedWords: ['배우다', '알다', '겪다'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'reading',
    mainCategory: '추상 개념',
    subCategory: '경험',
    phonemeRules: [],
    standardPronunciation: '[경험]',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },

  // ========== TOPIK 2급 - 쓰기 영역 ==========
  {
    koreanWord: '생각하다',
    mongolianWord: 'Бодох',
    imageUrl: '/images/words/think.jpg',
    description: '머릿속으로 어떤 것을 떠올리다',
    pronunciation: 'saeng-gak-ha-da',
    category: 'mental',
    order: 1012,
    examples: [
      { korean: '고향을 생각해요.', mongolian: 'Нутгаа бодож байна.' },
      { korean: '어떻게 생각해요?', mongolian: 'Юу гэж бодож байна вэ?' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['생각을 하다', '생각이 나다'],
    relatedWords: ['마음', '기억', '느끼다'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'writing',
    mainCategory: '정신 활동',
    subCategory: '사고',
    phonemeRules: [],
    standardPronunciation: '[생가카다]',
    difficultyScore: 30,
    wordType: 'verb',
    formalityLevel: 'neutral',
    grammarPattern: '-고 생각하다',
  },
  {
    koreanWord: '문화',
    mongolianWord: 'Соёл',
    imageUrl: '/images/words/culture.jpg',
    description: '한 사회의 생활 방식과 예술',
    pronunciation: 'mun-hwa',
    category: 'culture',
    order: 1013,
    examples: [
      { korean: '한국 문화를 배워요.', mongolian: 'Солонгосын соёлыг сурна.' },
      { korean: '문화가 다르지만 재미있어요.', mongolian: 'Соёл өөр ч сонирхолтой.' },
    ],
    synonyms: [],
    antonyms: [],
    collocations: ['문화가 다르다', '문화를 배우다'],
    relatedWords: ['전통', '관습', '역사'],
    programType: 'topik',
    level: { topik: 2, cefr: 'A2' },
    testSection: 'writing',
    mainCategory: '문화와 예술',
    subCategory: '문화',
    phonemeRules: [],
    standardPronunciation: '[문화]',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'neutral',
  },
];

async function seedTopikWords() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    console.log(`\n📚 Seeding ${topikWords.length} TOPIK 1-2 words...\n`);

    let insertedCount = 0;
    const errors: string[] = [];

    for (const word of topikWords) {
      try {
        await Word.create(word);
        insertedCount++;
        console.log(
          `✅ ${insertedCount}/${topikWords.length}: ${word.koreanWord} (${word.mongolianWord}) - ${word.testSection} - TOPIK ${word.level.topik}급`
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

    // Summary by test section
    console.log('\n📊 Summary by Test Section:');
    const sectionCount: { [key: string]: number } = {};
    topikWords.forEach((word) => {
      if (word.testSection) {
        sectionCount[word.testSection] = (sectionCount[word.testSection] || 0) + 1;
      }
    });
    Object.entries(sectionCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([section, count]) => {
        console.log(`   ${section}: ${count} words`);
      });

    // Summary by TOPIK level
    console.log('\n📊 Summary by TOPIK Level:');
    const levelCount: { [key: number]: number } = {};
    topikWords.forEach((word) => {
      if (word.level.topik) {
        levelCount[word.level.topik] = (levelCount[word.level.topik] || 0) + 1;
      }
    });
    Object.entries(levelCount)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([level, count]) => {
        console.log(`   TOPIK ${level}: ${count} words`);
      });

    // Summary by category
    console.log('\n📊 Summary by Category:');
    const categoryCount: { [key: string]: number } = {};
    topikWords.forEach((word) => {
      categoryCount[word.mainCategory] = (categoryCount[word.mainCategory] || 0) + 1;
    });
    Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} words`);
      });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding TOPIK words:', error);
    process.exit(1);
  }
}

seedTopikWords();
