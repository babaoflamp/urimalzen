import mongoose from 'mongoose';
import Word from '../models/Word';
import dotenv from 'dotenv';

dotenv.config();

const advancedWords = [
  // Level 3 (중급1) - B1
  {
    koreanWord: '취업',
    mongolianWord: 'Ажилд орох',
    imageUrl: '/images/words/employment.jpg',
    description: '직장을 얻어 일하게 되는 것을 말합니다.',
    pronunciation: 'chwi-eop',
    order: 44,
    examples: [
      { korean: '대학 졸업 후 취업했습니다', mongolian: 'Их сургууль төгссөний дараа ажилд орсон' },
      { korean: '취업 준비를 하고 있어요', mongolian: 'Ажилд орох бэлтгэл хийж байна' }
    ],
    synonyms: ['고용'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '직업과 일',
    subCategory: '구직',
    phonemeRules: [],
    standardPronunciation: '취업',
    difficultyScore: 40,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '면접',
    mongolianWord: 'Ярилцлага',
    imageUrl: '/images/words/interview.jpg',
    description: '직장에 들어가기 전 직접 만나서 대화하는 시험입니다.',
    pronunciation: 'myeon-jeop',
    order: 45,
    examples: [
      { korean: '내일 면접이 있어요', mongolian: 'Маргааш ярилцлага байна' },
      { korean: '면접을 잘 봤습니다', mongolian: 'Ярилцлага сайн өгсөн' }
    ],
    synonyms: ['인터뷰'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '직업과 일',
    subCategory: '구직',
    phonemeRules: [],
    standardPronunciation: '면접',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '계약',
    mongolianWord: 'Гэрээ',
    imageUrl: '/images/words/contract.jpg',
    description: '서로 약속하고 문서로 만드는 것입니다.',
    pronunciation: 'gye-yak',
    order: 46,
    examples: [
      { korean: '계약서에 서명했어요', mongolian: 'Гэрээнд гарын үсэг зурсан' },
      { korean: '1년 계약입니다', mongolian: '1 жилийн гэрээ' }
    ],
    synonyms: ['약정'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '경제 생활',
    subCategory: '법률',
    phonemeRules: [],
    standardPronunciation: '계약',
    difficultyScore: 45,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '임금',
    mongolianWord: 'Цалин',
    imageUrl: '/images/words/wage.jpg',
    description: '일한 대가로 받는 돈입니다.',
    pronunciation: 'im-geum',
    order: 47,
    examples: [
      { korean: '임금을 매달 받아요', mongolian: 'Цалин сар бүр авдаг' },
      { korean: '최저 임금이 올랐어요', mongolian: 'Хамгийн бага цалин өссөн' }
    ],
    synonyms: ['급여', '월급'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '경제 생활',
    subCategory: '금융',
    phonemeRules: ['비음화'],
    standardPronunciation: '임금',
    difficultyScore: 40,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '은행',
    mongolianWord: 'Банк',
    imageUrl: '/images/words/bank.jpg',
    description: '돈을 맡기고 빌려주는 곳입니다.',
    pronunciation: 'eun-haeng',
    order: 48,
    examples: [
      { korean: '은행에서 돈을 찾았어요', mongolian: 'Банкнаас мөнгө авсан' },
      { korean: '은행 계좌를 만들었어요', mongolian: 'Банкны данс нээсэн' }
    ],
    synonyms: [],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '경제 생활',
    subCategory: '금융',
    phonemeRules: [],
    standardPronunciation: '은행',
    difficultyScore: 30,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '저축',
    mongolianWord: 'Хадгаламж',
    imageUrl: '/images/words/savings.jpg',
    description: '돈을 모아서 보관하는 것입니다.',
    pronunciation: 'jeo-chuk',
    order: 49,
    examples: [
      { korean: '매달 저축을 해요', mongolian: 'Сар бүр хадгаламж хийдэг' },
      { korean: '저축 습관이 중요해요', mongolian: 'Хадгаламжийн зуршил чухал' }
    ],
    synonyms: ['적금'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '경제 생활',
    subCategory: '금융',
    phonemeRules: [],
    standardPronunciation: '저축',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '보험',
    mongolianWord: 'Даатгал',
    imageUrl: '/images/words/insurance.jpg',
    description: '미래의 위험을 대비해 돈을 내는 제도입니다.',
    pronunciation: 'bo-heom',
    order: 50,
    examples: [
      { korean: '건강보험에 가입했어요', mongolian: 'Эрүүл мэндийн даатгалд элссэн' },
      { korean: '보험료를 매달 내요', mongolian: 'Даатгалын төлбөр сар бүр төлдөг' }
    ],
    synonyms: [],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '경제 생활',
    subCategory: '금융',
    phonemeRules: [],
    standardPronunciation: '보험',
    difficultyScore: 40,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '문화',
    mongolianWord: 'Соёл',
    imageUrl: '/images/words/culture.jpg',
    description: '한 나라나 민족의 생활 방식과 예술을 말합니다.',
    pronunciation: 'mun-hwa',
    order: 51,
    examples: [
      { korean: '한국 문화를 배우고 있어요', mongolian: 'Солонгос соёл сурч байна' },
      { korean: '문화 차이가 있어요', mongolian: 'Соёлын ялгаа байдаг' }
    ],
    synonyms: [],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '사회와 문화',
    subCategory: '문화',
    phonemeRules: [],
    standardPronunciation: '문화',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '전통',
    mongolianWord: 'Уламжлал',
    imageUrl: '/images/words/tradition.jpg',
    description: '옛날부터 이어져 내려오는 풍습이나 방식입니다.',
    pronunciation: 'jeon-tong',
    order: 52,
    examples: [
      { korean: '한국의 전통 음식을 좋아해요', mongolian: 'Солонгосын уламжлалт хоол дуртай' },
      { korean: '전통을 지켜야 해요', mongolian: 'Уламжлалыг хадгалах хэрэгтэй' }
    ],
    synonyms: [],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '사회와 문화',
    subCategory: '문화',
    phonemeRules: [],
    standardPronunciation: '전통',
    difficultyScore: 40,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '예절',
    mongolianWord: 'Ёс заншил',
    imageUrl: '/images/words/etiquette.jpg',
    description: '사람들이 지켜야 할 바른 행동입니다.',
    pronunciation: 'ye-jeol',
    order: 53,
    examples: [
      { korean: '식사 예절을 배웠어요', mongolian: 'Хоолны ёс заншил сурсан' },
      { korean: '예절을 지켜야 해요', mongolian: 'Ёс заншил дагах хэрэгтэй' }
    ],
    synonyms: ['매너'],
    level: { kiip: 3, cefr: 'B1' },
    mainCategory: '사회와 문화',
    subCategory: '문화',
    phonemeRules: [],
    standardPronunciation: '예절',
    difficultyScore: 35,
    wordType: 'noun',
    formalityLevel: 'formal'
  },

  // Level 4 (중급2) - B2
  {
    koreanWord: '경제',
    mongolianWord: 'Эдийн засаг',
    imageUrl: '/images/words/economy.jpg',
    description: '나라의 생산, 소비, 무역 활동을 말합니다.',
    pronunciation: 'gyeong-je',
    order: 54,
    examples: [
      { korean: '경제가 발전하고 있어요', mongolian: 'Эдийн засаг хөгжиж байна' },
      { korean: '경제 뉴스를 봐요', mongolian: 'Эдийн засгийн мэдээ үздэг' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '경제 생활',
    subCategory: '경제',
    phonemeRules: [],
    standardPronunciation: '경제',
    difficultyScore: 50,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '정치',
    mongolianWord: 'Улс төр',
    imageUrl: '/images/words/politics.jpg',
    description: '나라를 다스리는 일입니다.',
    pronunciation: 'jeong-chi',
    order: 55,
    examples: [
      { korean: '정치에 관심이 많아요', mongolian: 'Улс төрд их сонирхолтой' },
      { korean: '정치 토론을 봤어요', mongolian: 'Улс төрийн мэтгэлцээн үзсэн' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '정치',
    phonemeRules: [],
    standardPronunciation: '정치',
    difficultyScore: 55,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '법률',
    mongolianWord: 'Хууль',
    imageUrl: '/images/words/law.jpg',
    description: '국가에서 만든 규칙입니다.',
    pronunciation: 'beop-ryul',
    order: 56,
    examples: [
      { korean: '법률을 지켜야 해요', mongolian: 'Хуулийг дагаж мөрдөх хэрэгтэй' },
      { korean: '법률 상담을 받았어요', mongolian: 'Хуулийн зөвлөгөө авсан' }
    ],
    synonyms: ['법', '법규'],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '법률',
    phonemeRules: ['유음화'],
    standardPronunciation: '범뉼',
    difficultyScore: 60,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '권리',
    mongolianWord: 'Эрх',
    imageUrl: '/images/words/rights.jpg',
    description: '법으로 보장된 자유와 이익입니다.',
    pronunciation: 'gwon-ri',
    order: 57,
    examples: [
      { korean: '모든 사람은 평등한 권리가 있어요', mongolian: 'Бүх хүн тэгш эрхтэй' },
      { korean: '노동자의 권리를 지켜요', mongolian: 'Ажилчны эрхийг хамгаалах' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '법률',
    phonemeRules: ['유음화'],
    standardPronunciation: '권니',
    difficultyScore: 55,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '의무',
    mongolianWord: 'Үүрэг',
    imageUrl: '/images/words/duty.jpg',
    description: '반드시 해야 하는 일입니다.',
    pronunciation: 'ui-mu',
    order: 58,
    examples: [
      { korean: '세금을 내는 것은 의무예요', mongolian: 'Татвар төлөх нь үүрэг' },
      { korean: '의무 교육을 받아요', mongolian: 'Заавал сургууль явах' }
    ],
    synonyms: ['책임'],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '법률',
    phonemeRules: [],
    standardPronunciation: '의무',
    difficultyScore: 50,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '환경',
    mongolianWord: 'Орчин',
    imageUrl: '/images/words/environment.jpg',
    description: '사람이 생활하는 주변의 자연입니다.',
    pronunciation: 'hwan-gyeong',
    order: 59,
    examples: [
      { korean: '환경 보호가 중요해요', mongolian: 'Байгаль орчныг хамгаалах чухал' },
      { korean: '환경 문제를 해결해야 해요', mongolian: 'Орчны асуудлыг шийдэх хэрэгтэй' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '자연과 환경',
    subCategory: '환경',
    phonemeRules: [],
    standardPronunciation: '환경',
    difficultyScore: 45,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '오염',
    mongolianWord: 'Бохирдол',
    imageUrl: '/images/words/pollution.jpg',
    description: '환경이 더러워지는 것입니다.',
    pronunciation: 'o-yeom',
    order: 60,
    examples: [
      { korean: '대기 오염이 심각해요', mongolian: 'Агаарын бохирдол хүнд байна' },
      { korean: '수질 오염을 막아야 해요', mongolian: 'Усны бохирдлыг зогсоох хэрэгтэй' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '자연과 환경',
    subCategory: '환경',
    phonemeRules: [],
    standardPronunciation: '오염',
    difficultyScore: 50,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '재활용',
    mongolianWord: 'Дахин ашиглалт',
    imageUrl: '/images/words/recycling.jpg',
    description: '쓴 물건을 다시 사용하는 것입니다.',
    pronunciation: 'jae-hwal-yong',
    order: 61,
    examples: [
      { korean: '재활용을 실천해요', mongolian: 'Дахин ашиглалт хийх' },
      { korean: '재활용 쓰레기를 분리해요', mongolian: 'Дахин боловсруулах хог ялгах' }
    ],
    synonyms: ['리사이클'],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '자연과 환경',
    subCategory: '환경',
    phonemeRules: [],
    standardPronunciation: '재활용',
    difficultyScore: 55,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '복지',
    mongolianWord: 'Халамж',
    imageUrl: '/images/words/welfare.jpg',
    description: '국민의 행복한 삶을 위한 제도입니다.',
    pronunciation: 'bok-ji',
    order: 62,
    examples: [
      { korean: '사회 복지 제도가 좋아요', mongolian: 'Нийгмийн халамжийн тогтолцоо сайн' },
      { korean: '복지 혜택을 받아요', mongolian: 'Халамжийн тусламж авах' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '복지',
    phonemeRules: [],
    standardPronunciation: '복찌',
    difficultyScore: 50,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '차별',
    mongolianWord: 'Ялгаварлалт',
    imageUrl: '/images/words/discrimination.jpg',
    description: '공평하지 않게 다르게 대하는 것입니다.',
    pronunciation: 'cha-byeol',
    order: 63,
    examples: [
      { korean: '차별 없는 사회를 만들어요', mongolian: 'Ялгаваргүй нийгэм бий болгох' },
      { korean: '성별 차별을 반대해요', mongolian: 'Хүйсийн ялгаварлалтыг эсэргүүцэх' }
    ],
    synonyms: [],
    level: { kiip: 4, cefr: 'B2' },
    mainCategory: '사회와 문화',
    subCategory: '사회',
    phonemeRules: [],
    standardPronunciation: '차별',
    difficultyScore: 55,
    wordType: 'noun',
    formalityLevel: 'formal'
  },

  // Level 5 (고급) - C1-C2
  {
    koreanWord: '통합',
    mongolianWord: 'Нэгдэл',
    imageUrl: '/images/words/integration.jpg',
    description: '여러 것을 하나로 모으는 것입니다.',
    pronunciation: 'tong-hap',
    order: 64,
    examples: [
      { korean: '사회 통합이 필요해요', mongolian: 'Нийгмийн нэгдэл хэрэгтэй' },
      { korean: '문화 통합 정책을 시행해요', mongolian: 'Соёлын нэгдлийн бодлого хэрэгжүүлэх' }
    ],
    synonyms: ['융합'],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '사회',
    phonemeRules: [],
    standardPronunciation: '통합',
    difficultyScore: 65,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '다문화',
    mongolianWord: 'Олон соёл',
    imageUrl: '/images/words/multiculture.jpg',
    description: '여러 문화가 함께 존재하는 것입니다.',
    pronunciation: 'da-mun-hwa',
    order: 65,
    examples: [
      { korean: '다문화 가정이 증가하고 있어요', mongolian: 'Олон соёлт гэр бүл нэмэгдэж байна' },
      { korean: '다문화 정책을 연구해요', mongolian: 'Олон соёлын бодлого судлах' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '문화',
    phonemeRules: [],
    standardPronunciation: '다문화',
    difficultyScore: 60,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '민주주의',
    mongolianWord: 'Ардчилал',
    imageUrl: '/images/words/democracy.jpg',
    description: '국민이 나라의 주인인 제도입니다.',
    pronunciation: 'min-ju-ju-ui',
    order: 66,
    examples: [
      { korean: '민주주의를 실천해요', mongolian: 'Ардчиллыг хэрэгжүүлэх' },
      { korean: '민주주의 국가에 살아요', mongolian: 'Ардчилсан улсад амьдрах' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '정치',
    phonemeRules: [],
    standardPronunciation: '민주주의',
    difficultyScore: 70,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '헌법',
    mongolianWord: 'Үндсэн хууль',
    imageUrl: '/images/words/constitution.jpg',
    description: '나라의 가장 기본이 되는 법입니다.',
    pronunciation: 'heon-beop',
    order: 67,
    examples: [
      { korean: '헌법을 준수해야 해요', mongolian: 'Үндсэн хуулийг дагаж мөрдөх хэрэгтэй' },
      { korean: '헌법으로 권리를 보장받아요', mongolian: 'Үндсэн хуулиар эрхээ хамгаалуулах' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C2' },
    mainCategory: '사회와 문화',
    subCategory: '법률',
    phonemeRules: [],
    standardPronunciation: '헌법',
    difficultyScore: 75,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '세계화',
    mongolianWord: 'Даяаршил',
    imageUrl: '/images/words/globalization.jpg',
    description: '세계가 하나로 연결되는 현상입니다.',
    pronunciation: 'se-gye-hwa',
    order: 68,
    examples: [
      { korean: '세계화 시대에 살고 있어요', mongolian: 'Даяаршлын эрин үед амьдарч байна' },
      { korean: '세계화가 빠르게 진행돼요', mongolian: 'Даяаршил хурдан явагдаж байна' }
    ],
    synonyms: ['글로벌화'],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '사회',
    phonemeRules: [],
    standardPronunciation: '세계화',
    difficultyScore: 65,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '지속가능성',
    mongolianWord: 'Тогтвортой байдал',
    imageUrl: '/images/words/sustainability.jpg',
    description: '환경을 해치지 않고 오래 유지할 수 있는 성질입니다.',
    pronunciation: 'ji-sok-ga-neung-seong',
    order: 69,
    examples: [
      { korean: '지속가능성을 추구해요', mongolian: 'Тогтвортой байдлыг эрэлхийлэх' },
      { korean: '지속가능한 발전이 중요해요', mongolian: 'Тогтвортой хөгжил чухал' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C2' },
    mainCategory: '자연과 환경',
    subCategory: '환경',
    phonemeRules: ['비음화'],
    standardPronunciation: '지속가능성',
    difficultyScore: 80,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '윤리',
    mongolianWord: 'Ёс зүй',
    imageUrl: '/images/words/ethics.jpg',
    description: '사람으로서 지켜야 할 도리입니다.',
    pronunciation: 'yun-ri',
    order: 70,
    examples: [
      { korean: '직업 윤리를 지켜요', mongolian: 'Мэргэжлийн ёс зүйг дагах' },
      { korean: '윤리적 판단이 필요해요', mongolian: 'Ёс зүйн үнэлэлт хэрэгтэй' }
    ],
    synonyms: ['도덕'],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '사회',
    phonemeRules: ['유음화'],
    standardPronunciation: '윤니',
    difficultyScore: 70,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '인권',
    mongolianWord: 'Хүний эрх',
    imageUrl: '/images/words/humanrights.jpg',
    description: '사람이 태어나면서부터 가지는 기본 권리입니다.',
    pronunciation: 'in-gwon',
    order: 71,
    examples: [
      { korean: '인권을 존중해야 해요', mongolian: 'Хүний эрхийг хүндэтгэх хэрэгтэй' },
      { korean: '인권 침해를 막아요', mongolian: 'Хүний эрх зөрчигдөхөөс сэргийлэх' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '법률',
    phonemeRules: ['비음화'],
    standardPronunciation: '인꿘',
    difficultyScore: 65,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '양성평등',
    mongolianWord: 'Хүйсийн тэгш байдал',
    imageUrl: '/images/words/genderequality.jpg',
    description: '남녀가 동등한 권리와 기회를 가지는 것입니다.',
    pronunciation: 'yang-seong-pyeong-deung',
    order: 72,
    examples: [
      { korean: '양성평등을 실현해요', mongolian: 'Хүйсийн тэгш байдлыг хэрэгжүүлэх' },
      { korean: '양성평등 교육을 받아요', mongolian: 'Хүйсийн тэгш байдлын боловсрол эзэмшсэн' }
    ],
    synonyms: ['남녀평등'],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '사회와 문화',
    subCategory: '사회',
    phonemeRules: [],
    standardPronunciation: '양성평등',
    difficultyScore: 70,
    wordType: 'noun',
    formalityLevel: 'formal'
  },
  {
    koreanWord: '상호존중',
    mongolianWord: 'Харилцан хүндэтгэл',
    imageUrl: '/images/words/mutualrespect.jpg',
    description: '서로를 존중하고 배려하는 것입니다.',
    pronunciation: 'sang-ho-jon-jung',
    order: 73,
    examples: [
      { korean: '상호존중이 중요해요', mongolian: 'Харилцан хүндэтгэл чухал' },
      { korean: '문화 간 상호존중을 실천해요', mongolian: 'Соёл хоорондын хүндэтгэл үзүүлэх' }
    ],
    synonyms: [],
    level: { kiip: 5, cefr: 'C1' },
    mainCategory: '인간관계와 소통',
    subCategory: '관계',
    phonemeRules: [],
    standardPronunciation: '상호존중',
    difficultyScore: 65,
    wordType: 'noun',
    formalityLevel: 'formal'
  }
];

const seedAdvancedWords = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Insert new words
    await Word.insertMany(advancedWords);
    console.log(`${advancedWords.length} advanced words seeded successfully`);
    
    // Show summary
    const level3Count = advancedWords.filter(w => w.level.kiip === 3).length;
    const level4Count = advancedWords.filter(w => w.level.kiip === 4).length;
    const level5Count = advancedWords.filter(w => w.level.kiip === 5).length;
    
    console.log('\n📊 Summary:');
    console.log(`Level 3 (중급1/B1): ${level3Count}개`);
    console.log(`Level 4 (중급2/B2): ${level4Count}개`);
    console.log(`Level 5 (고급/C1-C2): ${level5Count}개`);
    console.log(`Total: ${advancedWords.length}개`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdvancedWords();
