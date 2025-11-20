import mongoose from 'mongoose';
import Word from '../models/Word';
import dotenv from 'dotenv';

dotenv.config();

const words = [
  {
    koreanWord: '민들레',
    mongolianWord: 'Цэцэрлэг',
    imageUrl: '/images/dandelion.jpg',
    description: '민들레는 봄에 노란 꽃이 피는 다년생 식물입니다. 꽃이 진 후에는 흰 솜털 같은 씨앗이 바람에 날아갑니다. 공원이나 길가에서 쉽게 볼 수 있는 친근한 꽃입니다.',
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
    description: '원추리는 여름에 주황색이나 노란색 꽃이 피는 여러해살이풀입니다. 나팔 모양의 꽃이 하루만 피었다가 집니다. 정원에서 관상용으로 많이 심는 아름다운 꽃입니다.',
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
    description: '들국화는 가을에 들판에서 피는 야생 국화입니다. 노란색이나 흰색의 작은 꽃들이 무리지어 핍니다. 가을의 정취를 느끼게 해주는 대표적인 꽃입니다.',
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
    description: '은방울은 봄에 피는 작고 하얀 종 모양의 꽃입니다. 달콤하고 상쾌한 향기가 매우 좋습니다. 그늘진 곳에서도 잘 자라는 아름다운 꽃입니다.',
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
    description: '개나리는 이른 봄에 가장 먼저 피는 노란 꽃입니다. 잎보다 꽃이 먼저 피어서 봄의 전령사라고 불립니다. 가지에 빼곡하게 달린 노란 꽃이 매우 화려합니다.',
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
    description: '진달래는 봄에 산에서 피는 분홍색 꽃입니다. 꽃잎을 먹을 수 있어서 화전을 만들기도 합니다. 한국의 봄을 대표하는 아름다운 꽃입니다.',
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
    description: '패랭이는 여름에 피는 분홍색이나 흰색의 꽃입니다. 꽃잎 가장자리가 톱니처럼 갈라져 있습니다. 카네이션의 야생 조상으로 알려진 꽃입니다.',
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
    description: '제비꽃은 이른 봄에 피는 작고 보라색 꽃입니다. 숲이나 풀밭에서 낮게 자라며 은은한 향기가 납니다. 제비가 날아올 때 핀다고 해서 제비꽃이라는 이름이 붙었습니다.',
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
    description: '해바라기는 여름에 피는 크고 노란 꽃입니다. 해를 따라 꽃이 돌아가는 특징이 있습니다. 씨앗은 먹을 수 있고 기름을 짜기도 합니다.',
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
