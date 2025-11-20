import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PhonemeRule from '../models/PhonemeRule';

dotenv.config();

const phonemeRules = [
  {
    ruleName: '연음',
    ruleNameEn: 'Liaison',
    ruleNameMn: 'Залгах дууны дүрэм',
    description: '받침이 뒤의 모음으로 이어지는 현상',
    descriptionMn: 'Сүүлийн гийгүүлэгч дараагийн эгшгээр холбогдох үзэгдэл',
    pattern: '받침 + 모음',
    examples: [
      {
        word: '옷이',
        written: '옷이',
        pronounced: '[오시]',
        writtenMn: 'хувцас-ийн',
        pronouncedMn: 'оси',
      },
      {
        word: '밥을',
        written: '밥을',
        pronounced: '[바블]',
        writtenMn: 'будаа-ийг',
        pronouncedMn: 'бабыл',
      },
      {
        word: '책을',
        written: '책을',
        pronounced: '[채글]',
        writtenMn: 'ном-ийг',
        pronouncedMn: 'чэгыл',
      },
      {
        word: '집에',
        written: '집에',
        pronounced: '[지베]',
        writtenMn: 'гэр-т',
        pronouncedMn: 'жибэ',
      },
    ],
    kiipLevel: 1,
    order: 1,
  },
  {
    ruleName: '비음화',
    ruleNameEn: 'Nasalization',
    ruleNameMn: 'Хамрын дуу болох дүрэм',
    description: '받침 ㄱ, ㄷ, ㅂ이 비음 ㄴ, ㅁ 앞에서 ㅇ, ㄴ, ㅁ으로 변하는 현상',
    descriptionMn: 'ㄱ, ㄷ, ㅂ гийгүүлэгч нь ㄴ, ㅁ-ийн өмнө ㅇ, ㄴ, ㅁ болж хувирах үзэгдэл',
    pattern: '(ㄱ|ㄷ|ㅂ) + (ㄴ|ㅁ)',
    examples: [
      {
        word: '국물',
        written: '국물',
        pronounced: '[궁물]',
        writtenMn: 'шөл',
        pronouncedMn: 'гунмул',
      },
      {
        word: '밥만',
        written: '밥만',
        pronounced: '[밤만]',
        writtenMn: 'зөвхөн будаа',
        pronouncedMn: 'памман',
      },
      {
        word: '꽃망울',
        written: '꽃망울',
        pronounced: '[꼰망울]',
        writtenMn: 'цэцгийн нахиа',
        pronouncedMn: 'ккотмангул',
      },
      {
        word: '닫는',
        written: '닫는',
        pronounced: '[단는]',
        writtenMn: 'хаадаг',
        pronouncedMn: 'тадын',
      },
    ],
    kiipLevel: 2,
    order: 2,
  },
  {
    ruleName: '유음화',
    ruleNameEn: 'Liquidization',
    ruleNameMn: 'Шингэн дуу болох дүрэм',
    description: 'ㄴ과 ㄹ이 만날 때 모두 ㄹ로 변하는 현상',
    descriptionMn: 'ㄴ болон ㄹ нийлэхэд хоёулаа ㄹ болж хувирах үзэгдэл',
    pattern: 'ㄴ + ㄹ 또는 ㄹ + ㄴ',
    examples: [
      {
        word: '신라',
        written: '신라',
        pronounced: '[실라]',
        writtenMn: 'Силла',
        pronouncedMn: 'силла',
      },
      {
        word: '천리',
        written: '천리',
        pronounced: '[철리]',
        writtenMn: 'мянган ли',
        pronouncedMn: 'чолли',
      },
      {
        word: '관련',
        written: '관련',
        pronounced: '[괄련]',
        writtenMn: 'холбоотой',
        pronouncedMn: 'гвалён',
      },
      {
        word: '칼날',
        written: '칼날',
        pronounced: '[칼랄]',
        writtenMn: 'хутганы ир',
        pronouncedMn: 'каллал',
      },
    ],
    kiipLevel: 2,
    order: 3,
  },
  {
    ruleName: '구개음화',
    ruleNameEn: 'Palatalization',
    ruleNameMn: 'Тагнайн дуу болох дүрэм',
    description: 'ㄷ, ㅌ이 이 모음을 만나 ㅈ, ㅊ로 변하는 현상',
    descriptionMn: 'ㄷ, ㅌ нь "이" эгшигтэй уулзахад ㅈ, ㅊ болж хувирах үзэгдэл',
    pattern: '(ㄷ|ㅌ) + 이',
    examples: [
      {
        word: '같이',
        written: '같이',
        pronounced: '[가치]',
        writtenMn: 'хамт',
        pronouncedMn: 'гачи',
      },
      {
        word: '굳이',
        written: '굳이',
        pronounced: '[구지]',
        writtenMn: 'заавал',
        pronouncedMn: 'гужи',
      },
      {
        word: '해돋이',
        written: '해돋이',
        pronounced: '[해도지]',
        writtenMn: 'нар мандах',
        pronouncedMn: 'хэтожи',
      },
      {
        word: '붙이다',
        written: '붙이다',
        pronounced: '[부치다]',
        writtenMn: 'наах',
        pronouncedMn: 'бучида',
      },
    ],
    kiipLevel: 2,
    order: 4,
  },
  {
    ruleName: '경음화',
    ruleNameEn: 'Tensification',
    ruleNameMn: 'Хатуу дуу болох дүрэм',
    description: '예사소리가 된소리로 변하는 현상',
    descriptionMn: 'Энгийн дуу хатуу дуу болж хувирах үзэгдэл',
    pattern: '받침 + (ㄱ|ㄷ|ㅂ|ㅅ|ㅈ)',
    examples: [
      {
        word: '학교',
        written: '학교',
        pronounced: '[학꾜]',
        writtenMn: 'сургууль',
        pronouncedMn: 'хаккё',
      },
      {
        word: '입구',
        written: '입구',
        pronounced: '[입꾸]',
        writtenMn: 'орох хаалга',
        pronouncedMn: 'иппку',
      },
      {
        word: '꽃다발',
        written: '꽃다발',
        pronounced: '[꼳따발]',
        writtenMn: 'цэцгийн баглаа',
        pronouncedMn: 'ккоттабал',
      },
      {
        word: '책상',
        written: '책상',
        pronounced: '[책쌍]',
        writtenMn: 'ширээ',
        pronouncedMn: 'чэкссан',
      },
    ],
    kiipLevel: 2,
    order: 5,
  },
];

async function seedPhonemeRules() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing phoneme rules
    await PhonemeRule.deleteMany({});
    console.log('Existing phoneme rules cleared');

    // Insert phoneme rules
    const result = await PhonemeRule.insertMany(phonemeRules);
    console.log(`✅ Successfully seeded ${result.length} phoneme rules`);

    // Display results
    result.forEach((rule) => {
      console.log(`${rule.order}. ${rule.ruleName} (${rule.ruleNameEn}) - KIIP ${rule.kiipLevel}`);
      console.log(`   예시: ${rule.examples.map((ex) => `${ex.word} → ${ex.pronounced}`).join(', ')}`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding phoneme rules:', error);
    process.exit(1);
  }
}

seedPhonemeRules();
