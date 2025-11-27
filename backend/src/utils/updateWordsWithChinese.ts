import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Word';

dotenv.config();

/**
 * 기존 단어 데이터에 중국어 번역 추가
 */
const chineseTranslations = [
  // 9개 꽃 단어
  {
    koreanWord: '민들레',
    chineseWord: '蒲公英',
    examples: [
      { korean: '봄에 민들레 꽃이 핀다', chinese: '春天蒲公英花开' },
    ],
  },
  {
    koreanWord: '원추리',
    chineseWord: '萱草',
    examples: [
      { korean: '원추리가 정원에 피었다', chinese: '萱草在花园里开了' },
    ],
  },
  {
    koreanWord: '들국화',
    chineseWord: '野菊花',
    examples: [
      { korean: '가을에 들국화가 만발하다', chinese: '秋天野菊花盛开' },
    ],
  },
  {
    koreanWord: '은방울',
    chineseWord: '铃兰',
    examples: [
      { korean: '은방울 꽃이 향기롭다', chinese: '铃兰花很香' },
    ],
  },
  {
    koreanWord: '개나리',
    chineseWord: '连翘',
    examples: [
      { korean: '봄에 개나리가 가장 먼저 핀다', chinese: '春天连翘最先开花' },
    ],
  },
  {
    koreanWord: '진달래',
    chineseWord: '杜鹃花',
    examples: [
      { korean: '산에 진달래가 만발했다', chinese: '山上杜鹃花盛开了' },
    ],
  },
  {
    koreanWord: '패랭이',
    chineseWord: '石竹花',
    examples: [
      { korean: '패랭이꽃이 예쁘게 피었다', chinese: '石竹花开得很美' },
    ],
  },
  {
    koreanWord: '제비꽃',
    chineseWord: '紫罗兰',
    examples: [
      { korean: '제비꽃이 숲에서 자란다', chinese: '紫罗兰在森林里生长' },
    ],
  },
  {
    koreanWord: '해바라기',
    chineseWord: '向日葵',
    examples: [
      { korean: '해바라기가 해를 향해 돈다', chinese: '向日葵朝着太阳转' },
    ],
  },

  // 인사 및 자기소개
  {
    koreanWord: '안녕하세요',
    chineseWord: '你好',
    examples: [
      { korean: '안녕하세요? 저는 김철수입니다.', chinese: '你好？我是金哲洙。' },
      { korean: '선생님, 안녕하세요!', chinese: '老师，你好！' },
    ],
  },
  {
    koreanWord: '이름',
    chineseWord: '名字',
    examples: [
      { korean: '이름이 뭐예요?', chinese: '你叫什么名字？' },
      { korean: '제 이름은 바트입니다.', chinese: '我叫巴特。' },
    ],
  },
  {
    koreanWord: '나라',
    chineseWord: '国家',
    examples: [
      { korean: '어느 나라에서 왔어요?', chinese: '你从哪个国家来？' },
      { korean: '저는 몽골에서 왔어요.', chinese: '我从蒙古来。' },
    ],
  },

  // 음식
  {
    koreanWord: '밥',
    chineseWord: '米饭 / 饭',
    examples: [
      { korean: '밥을 먹어요.', chinese: '我在吃饭。' },
      { korean: '아침밥을 먹었어요?', chinese: '你吃早饭了吗？' },
    ],
  },
  {
    koreanWord: '물',
    chineseWord: '水',
    examples: [
      { korean: '물을 주세요.', chinese: '请给我水。' },
      { korean: '물을 마셔요.', chinese: '我在喝水。' },
    ],
  },
  {
    koreanWord: '김치',
    chineseWord: '泡菜',
    examples: [
      { korean: '김치를 먹어요.', chinese: '我在吃泡菜。' },
      { korean: '김치가 맵어요.', chinese: '泡菜很辣。' },
    ],
  },

  // 가족
  {
    koreanWord: '아버지',
    chineseWord: '父亲 / 爸爸',
    examples: [
      { korean: '우리 아버지는 회사원이에요.', chinese: '我父亲是公司职员。' },
      { korean: '아버지와 함께 산책해요.', chinese: '我和父亲一起散步。' },
    ],
  },
  {
    koreanWord: '어머니',
    chineseWord: '母亲 / 妈妈',
    examples: [
      { korean: '어머니는 요리를 잘해요.', chinese: '母亲做饭很好吃。' },
      { korean: '어머니께 전화했어요.', chinese: '我给母亲打了电话。' },
    ],
  },

  // 숫자
  {
    koreanWord: '하나',
    chineseWord: '一',
    examples: [
      { korean: '사과 하나 주세요.', chinese: '请给我一个苹果。' },
      { korean: '하나, 둘, 셋', chinese: '一、二、三' },
    ],
  },
  {
    koreanWord: '둘',
    chineseWord: '二',
    examples: [
      { korean: '커피 두 잔 주세요.', chinese: '请给我两杯咖啡。' },
      { korean: '둘이서 갑시다.', chinese: '我们两个人一起去吧。' },
    ],
  },

  // 시간
  {
    koreanWord: '오늘',
    chineseWord: '今天',
    examples: [
      { korean: '오늘 날씨가 좋아요.', chinese: '今天天气很好。' },
      { korean: '오늘은 월요일이에요.', chinese: '今天是星期一。' },
    ],
  },
  {
    koreanWord: '내일',
    chineseWord: '明天',
    examples: [
      { korean: '내일 만나요.', chinese: '明天见。' },
      { korean: '내일은 시험이 있어요.', chinese: '明天有考试。' },
    ],
  },
  {
    koreanWord: '어제',
    chineseWord: '昨天',
    examples: [
      { korean: '어제 영화를 봤어요.', chinese: '昨天看了电影。' },
      { korean: '어제는 바빴어요.', chinese: '昨天很忙。' },
    ],
  },

  // 장소
  {
    koreanWord: '집',
    chineseWord: '家',
    examples: [
      { korean: '집에 가요.', chinese: '我回家。' },
      { korean: '집이 어디예요?', chinese: '你家在哪里？' },
    ],
  },
  {
    koreanWord: '학교',
    chineseWord: '学校',
    examples: [
      { korean: '학교에 가요.', chinese: '我去学校。' },
      { korean: '학교에서 공부해요.', chinese: '我在学校学习。' },
    ],
  },
  {
    koreanWord: '병원',
    chineseWord: '医院',
    examples: [
      { korean: '병원에 갑시다.', chinese: '我们去医院吧。' },
      { korean: '병원에서 진료를 받았어요.', chinese: '我在医院看病了。' },
    ],
  },

  // 기본 동사
  {
    koreanWord: '가다',
    chineseWord: '去',
    examples: [
      { korean: '학교에 가요.', chinese: '我去学校。' },
      { korean: '어디 가요?', chinese: '你去哪里？' },
    ],
  },
  {
    koreanWord: '오다',
    chineseWord: '来',
    examples: [
      { korean: '우리 집에 오세요.', chinese: '请来我家。' },
      { korean: '언제 와요?', chinese: '你什么时候来？' },
    ],
  },
  {
    koreanWord: '먹다',
    chineseWord: '吃',
    examples: [
      { korean: '밥을 먹어요.', chinese: '我吃饭。' },
      { korean: '같이 먹을까요?', chinese: '我们一起吃吧？' },
    ],
  },
  {
    koreanWord: '마시다',
    chineseWord: '喝',
    examples: [
      { korean: '물을 마셔요.', chinese: '我喝水。' },
      { korean: '커피를 마셨어요.', chinese: '我喝了咖啡。' },
    ],
  },

  // 감사와 사과
  {
    koreanWord: '감사합니다',
    chineseWord: '谢谢',
    examples: [
      { korean: '도와주셔서 감사합니다.', chinese: '谢谢你的帮助。' },
      { korean: '정말 감사합니다.', chinese: '真的很感谢。' },
    ],
  },
  {
    koreanWord: '죄송합니다',
    chineseWord: '对不起',
    examples: [
      { korean: '늦어서 죄송합니다.', chinese: '对不起，我迟到了。' },
      { korean: '정말 죄송합니다.', chinese: '真的对不起。' },
    ],
  },
];

const updateWordsWithChinese = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen');
    console.log('✅ MongoDB 연결 성공');

    let updateCount = 0;

    for (const translation of chineseTranslations) {
      const word = await Word.findOne({ koreanWord: translation.koreanWord });

      if (!word) {
        console.log(`⚠️  "${translation.koreanWord}" 단어를 찾을 수 없습니다.`);
        continue;
      }

      // 중국어 단어 추가
      word.chineseWord = translation.chineseWord;

      // 예문에 중국어 추가
      if (translation.examples && word.examples) {
        for (let i = 0; i < translation.examples.length && i < word.examples.length; i++) {
          word.examples[i].chinese = translation.examples[i].chinese;
        }
      }

      await word.save();
      console.log(`✅ "${translation.koreanWord}" 단어에 중국어 번역 추가됨`);
      updateCount++;
    }

    console.log(`\n✅ 총 ${updateCount}개 단어에 중국어 번역이 추가되었습니다.`);

    await mongoose.connection.close();
    console.log('✅ MongoDB 연결 종료');
  } catch (error) {
    console.error('❌ 단어 업데이트 실패:', error);
    process.exit(1);
  }
};

// Run the update
updateWordsWithChinese();
