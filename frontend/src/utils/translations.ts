export const translations = {
  ko: {
    appName: 'KIIP 기반 AI 한국어 학습 플랫폼',
    progress: '진도',
    score: '점',
    globalRank: '세계',
    rank: '위',
    logout: '로그아웃',
    
    // Navigation
    levels: '단계별 학습',
    categories: '카테고리 학습',
    learning: '학습하기',
    pronunciation: '발음 분석',
    
    // Filter Panel
    kiipLevel: 'KIIP 단계',
    introductory: '입문',
    elementary1: '초급1',
    elementary2: '초급2',
    intermediate1: '중급1',
    intermediate2: '중급2',
    advanced: '고급',
    
    // Word List
    wordList: '학습 단어 목록',
    
    // Learning Area
    selectWord: '단어를 선택해주세요',
    pronunciation_label: '발음',
    
    // Recording Controls
    record: '녹음',
    stop: '정지',
    play: '재생',
    submit: '제출',
    
    // Self Study
    selfStudy: '자기주도 학습',
    myWords: '나만의 단어장',
    addWord: '단어 추가',
    
    // Ranking Info
    rankingInfo: '순위 정보',
    worldRank: '세계 순위',
    countryRank: '나라 순위',
    koreaRank: '한국 순위',
    regionRank: '지역 순위',
    completedWords: '완료한 단어',
    totalScore: '총 점수',
  },
  mn: {
    appName: 'KIIP суурьтай AI Солонгос хэл сургалтын платформ',
    progress: 'Явц',
    score: 'оноо',
    globalRank: 'Дэлхий',
    rank: 'байр',
    logout: 'Гарах',
    
    // Navigation
    levels: 'Шатлалаар сурах',
    categories: 'Ангиллаар сурах',
    learning: 'Сурах',
    pronunciation: 'Дуудлага шинжилгээ',
    
    // Filter Panel
    kiipLevel: 'KIIP Шат',
    introductory: 'Танилцуулга',
    elementary1: 'Анхан шат 1',
    elementary2: 'Анхан шат 2',
    intermediate1: 'Дунд шат 1',
    intermediate2: 'Дунд шат 2',
    advanced: 'Ахисан шат',
    
    // Word List
    wordList: 'Үгийн жагсаалт',
    
    // Learning Area
    selectWord: 'Үг сонгоно уу',
    pronunciation_label: 'Дуудлага',
    
    // Recording Controls
    record: 'Бичлэг',
    stop: 'Зогсоох',
    play: 'Тоглуулах',
    submit: 'Илгээх',
    
    // Self Study
    selfStudy: 'Өөрийн сурах',
    myWords: 'Миний үгийн сан',
    addWord: 'Үг нэмэх',
    
    // Ranking Info
    rankingInfo: 'Эрэмбийн мэдээлэл',
    worldRank: 'Дэлхийн эрэмбэ',
    countryRank: 'Улсын эрэмбэ',
    koreaRank: 'Солонгосын эрэмбэ',
    regionRank: 'Бүсийн эрэмбэ',
    completedWords: 'Дууссан үгс',
    totalScore: 'Нийт оноо',
  },
};

export type TranslationKey = keyof typeof translations.ko;
