import mongoose from 'mongoose';
import Word from '../models/Word';
import dotenv from 'dotenv';

dotenv.config();

const words = [
  {
    koreanWord: '민들레',
    mongolianWord: 'Цэцэрлэг',
    imageUrl: '/images/dandelion.jpg',
    description: '노란색 꽃이 피는 다년생 식물',
    pronunciation: 'min-deul-le',
    category: 'flower',
    order: 1,
    examples: [
      {
        korean: '봄에 민들레 꽃이 핀다',
        mongolian: 'Хавар цэцэрлэг цэцэглэнэ',
      },
    ],
    synonyms: ['만들레'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '원추리',
    mongolianWord: 'Хуануури',
    imageUrl: '/images/wonchuri.jpg',
    description: '원추리과의 여러해살이풀',
    pronunciation: 'won-chu-ri',
    category: 'flower',
    order: 2,
    examples: [
      {
        korean: '원추리가 정원에 피었다',
        mongolian: 'Хуануури цэцэрлэгт цэцэглэсэн',
      },
    ],
    synonyms: ['환주리'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '들국화',
    mongolianWord: 'Хээрийн хризантем',
    imageUrl: '/images/wild-chrysanthemum.jpg',
    description: '가을에 피는 들판의 국화',
    pronunciation: 'deul-guk-hwa',
    category: 'flower',
    order: 3,
    examples: [
      {
        korean: '가을에 들국화가 만발하다',
        mongolian: 'Намар хээрийн хризантем цэцэглэнэ',
      },
    ],
    synonyms: ['야국화'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '은방울',
    mongolianWord: 'Мөнгөн хонх',
    imageUrl: '/images/lily-of-the-valley.jpg',
    description: '작고 하얀 종 모양의 꽃',
    pronunciation: 'eun-bang-ul',
    category: 'flower',
    order: 4,
    examples: [
      {
        korean: '은방울 꽃이 향기롭다',
        mongolian: 'Мөнгөн хонх цэцэг анхилуун үнэртэй',
      },
    ],
    synonyms: ['은방울꽃'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '개나리',
    mongolianWord: 'Форзици',
    imageUrl: '/images/forsythia.jpg',
    description: '이른 봄에 노란 꽃이 피는 관목',
    pronunciation: 'gae-na-ri',
    category: 'flower',
    order: 5,
    examples: [
      {
        korean: '봄에 개나리가 가장 먼저 핀다',
        mongolian: 'Хавар форзици хамгийн түрүүнд цэцэглэнэ',
      },
    ],
    synonyms: [],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '진달래',
    mongolianWord: 'Азалиа',
    imageUrl: '/images/azalea.jpg',
    description: '봄에 분홍색 꽃이 피는 식물',
    pronunciation: 'jin-dal-lae',
    category: 'flower',
    order: 6,
    examples: [
      {
        korean: '산에 진달래가 만발했다',
        mongolian: 'Уулан дээр азалиа цэцэглэсэн',
      },
    ],
    synonyms: ['참꽃'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '패랭이',
    mongolianWord: 'Гвоздик',
    imageUrl: '/images/carnation.jpg',
    description: '꽃잎이 톱니 모양인 꽃',
    pronunciation: 'pae-raeng-i',
    category: 'flower',
    order: 7,
    examples: [
      {
        korean: '패랭이꽃이 예쁘게 피었다',
        mongolian: 'Гвоздик үзэсгэлэнтэй цэцэглэсэн',
      },
    ],
    synonyms: ['패랭이꽃'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '제비꽃',
    mongolianWord: 'Нил цэцэг',
    imageUrl: '/images/violet.jpg',
    description: '작고 보라색 꽃이 피는 식물',
    pronunciation: 'je-bi-kkot',
    category: 'flower',
    order: 8,
    examples: [
      {
        korean: '제비꽃이 숲에서 자란다',
        mongolian: 'Нил цэцэг ойд ургана',
      },
    ],
    synonyms: ['오랑캐꽃'],
    videoUrl: '',
    readingContent: '',
  },
  {
    koreanWord: '해바라기',
    mongolianWord: 'Наранцэцэг',
    imageUrl: '/images/sunflower.jpg',
    description: '태양을 따라 돌아가는 큰 노란 꽃',
    pronunciation: 'hae-ba-ra-gi',
    category: 'flower',
    order: 9,
    examples: [
      {
        korean: '해바라기가 해를 향해 돈다',
        mongolian: 'Наранцэцэг нарыг харан эргэнэ',
      },
    ],
    synonyms: ['해바라기꽃'],
    videoUrl: '',
    readingContent: '',
  },
];

const seedWords = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // Clear existing words
    await Word.deleteMany({});
    console.log('Existing words cleared');

    // Insert new words
    await Word.insertMany(words);
    console.log('9 flower words seeded successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedWords();
