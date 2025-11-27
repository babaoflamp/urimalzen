import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PronunciationTestSentence from '../models/PronunciationTestSentence';

dotenv.config();

/**
 * Seed 20 Korean test sentences for pronunciation evaluation
 * Based on korean-pro-demo's fixed test sentences
 * Covers various grammatical structures and difficulty levels
 */

const testSentences = [
  {
    sentenceNumber: 1,
    koreanText: '서울은 차도 많고 사람도 많아서 조금 복잡하지만 경치가 아름다운 도시입니다.',
    mongolianText: 'Сеул бол машин ч олон, хүн ч олон учраас жаахан цогцолбортой ч үзэсгэлэнтэй хот юм.',
    chineseText: '首尔车多人也多所以有点复杂，但是风景很美的城市。',
    difficultyLevel: 4,
    kiipLevel: 3,
    category: 'city',
    grammarPoints: ['~고', '~아서/어서', '~지만', '~ㅂ니다/습니다'],
    order: 1,
  },
  {
    sentenceNumber: 2,
    koreanText: '버스는 사람이 많아서 복잡하지만 회사에 빨리 갈 수 있어요.',
    mongolianText: 'Автобус нь хүн олон учраас цогцолбортой ч компанид хурдан очиж чадна.',
    chineseText: '公交车人多很拥挤，但是能快点去公司。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'transportation',
    grammarPoints: ['~이/가', '~아서/어서', '~지만', '~(으)ㄹ 수 있다'],
    order: 2,
  },
  {
    sentenceNumber: 3,
    koreanText: '공과금을 납부하러 은행에 갔어요.',
    mongolianText: 'Төлбөр төлөхөөр банк очсон.',
    chineseText: '去银行缴纳水电费了。',
    difficultyLevel: 2,
    kiipLevel: 1,
    category: 'banking',
    grammarPoints: ['~을/를', '~(으)러', '~았/었어요'],
    order: 3,
  },
  {
    sentenceNumber: 4,
    koreanText: '약을 사러 약국에 갔어요.',
    mongolianText: 'Эм худалдаж авахаар эмийн сан очсон.',
    chineseText: '去药店买药了。',
    difficultyLevel: 2,
    kiipLevel: 1,
    category: 'pharmacy',
    grammarPoints: ['~을/를', '~(으)러', '~았/었어요'],
    order: 4,
  },
  {
    sentenceNumber: 5,
    koreanText: '저는 버스를 자주 타는 편이에요.',
    mongolianText: 'Би автобус ихэвчлэн унадаг.',
    chineseText: '我经常坐公交车。',
    difficultyLevel: 2,
    kiipLevel: 2,
    category: 'transportation',
    grammarPoints: ['~을/를', '~는 편이다', '~아요/어요'],
    order: 5,
  },
  {
    sentenceNumber: 6,
    koreanText: '우리 아들은 키가 큰 편이에요.',
    mongolianText: 'Манай хүү нь өндөр хүн.',
    chineseText: '我儿子个子比较高。',
    difficultyLevel: 2,
    kiipLevel: 2,
    category: 'family',
    grammarPoints: ['~은/는', '~이/가', '~(으)ㄴ 편이다'],
    order: 6,
  },
  {
    sentenceNumber: 7,
    koreanText: '친구들과 맛있는 음식을 만들어 먹으면서 재미있게 지냈어요.',
    mongolianText: 'Найзуудтайгаа амттай хоол хийж идээд хөгжилтэй өнгөрүүлсэн.',
    chineseText: '和朋友们一边做好吃的食物一边开心地度过了。',
    difficultyLevel: 4,
    kiipLevel: 3,
    category: 'daily-life',
    grammarPoints: ['~와/과', '~(으)면서', '~았/었어요'],
    order: 7,
  },
  {
    sentenceNumber: 8,
    koreanText: '저는 음악을 들으면서 청소를 해요.',
    mongolianText: 'Би хөгжим сонсоод цэвэрлэдэг.',
    chineseText: '我一边听音乐一边打扫。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'daily-life',
    grammarPoints: ['~을/를', '~(으)면서', '~아요/어요'],
    order: 8,
  },
  {
    sentenceNumber: 9,
    koreanText: '몸이 아플 때 어머니 생각이 많이 나요.',
    mongolianText: 'Бие өвдөх үед ээжийгээ их санадаг.',
    chineseText: '身体不舒服的时候很想妈妈。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'family',
    grammarPoints: ['~이/가', '~(으)ㄹ 때', '~아요/어요'],
    order: 9,
  },
  {
    sentenceNumber: 10,
    koreanText: '힘들 때 친구가 생각나요.',
    mongolianText: 'Хэцүү үед найзаа санадаг.',
    chineseText: '累的时候想起朋友。',
    difficultyLevel: 2,
    kiipLevel: 2,
    category: 'friendship',
    grammarPoints: ['~(으)ㄹ 때', '~이/가', '~아요/어요'],
    order: 10,
  },
  {
    sentenceNumber: 11,
    koreanText: '불고기는 간장과 설탕 같은 양념이 들어갑니다.',
    mongolianText: 'Булгогид шүүс, элсэн чихэр зэрэг амтлагч орно.',
    chineseText: '烤肉里放酱油和糖等调料。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'food',
    grammarPoints: ['~은/는', '~와/과', '~같은', '~ㅂ니다/습니다'],
    order: 11,
  },
  {
    sentenceNumber: 12,
    koreanText: '김치에는 고춧가루와 마늘 같은 양념이 들어갑니다.',
    mongolianText: 'Кимчид улаан чинжүү, сармис зэрэг амтлагч орно.',
    chineseText: '泡菜里放辣椒粉和大蒜等调料。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'food',
    grammarPoints: ['~에는', '~와/과', '~같은', '~ㅂ니다/습니다'],
    order: 12,
  },
  {
    sentenceNumber: 13,
    koreanText: '나는 취업 준비를 하려고 컴퓨터 자격증 과정을 신청했다.',
    mongolianText: 'Би ажилд орохоор бэлтгэхийн тулд компьютерийн гэрчилгээний хөтөлбөрт бүртгүүлсэн.',
    chineseText: '我为了准备就业申请了计算机资格证课程。',
    difficultyLevel: 4,
    kiipLevel: 3,
    category: 'employment',
    grammarPoints: ['~을/를', '~(으)려고', '~았/었다'],
    order: 13,
  },
  {
    sentenceNumber: 14,
    koreanText: '저는 한국어 수업을 듣기 위해 교육센터에 신청했어요.',
    mongolianText: 'Би солонгос хэлний хичээл сонсохын тулд сургалтын төвд бүртгүүлсэн.',
    chineseText: '我为了上韩语课申请了教育中心。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'education',
    grammarPoints: ['~을/를', '~기 위해', '~았/었어요'],
    order: 14,
  },
  {
    sentenceNumber: 15,
    koreanText: '한국에 와서 성격도 활발해지고 친구들도 많아졌다.',
    mongolianText: 'Солонгост ирээд зан чанар нь ч идэвхтэй болж, найзууд нь ч олширсон.',
    chineseText: '来韩国后性格也变活泼了，朋友也多了。',
    difficultyLevel: 4,
    kiipLevel: 3,
    category: 'personal-growth',
    grammarPoints: ['~에', '~아서/어서', '~아지다/어지다', '~았/었다'],
    order: 15,
  },
  {
    sentenceNumber: 16,
    koreanText: '한국에 온 후 요리가 점점 쉬워졌어요.',
    mongolianText: 'Солонгост ирсний дараа хоол хийх нь аажмаар хялбар болсон.',
    chineseText: '来韩国后做饭越来越容易了。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'daily-life',
    grammarPoints: ['~(으)ㄴ 후', '~이/가', '~아지다/어지다', '~았/었어요'],
    order: 16,
  },
  {
    sentenceNumber: 17,
    koreanText: '택배를 보낼 때는 주소를 정확히 써 주세요.',
    mongolianText: 'Шуудан илгээх үед хаягийг зөв бичнэ үү.',
    chineseText: '寄快递的时候请准确写地址。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'postal',
    grammarPoints: ['~을/를', '~(으)ㄹ 때', '~아/어 주다', '~(으)세요'],
    order: 17,
  },
  {
    sentenceNumber: 18,
    koreanText: '시험에 응시할 때는 이름을 정확히 적어야 해요.',
    mongolianText: 'Шалгалт өгөх үед нэрийг зөв бичих хэрэгтэй.',
    chineseText: '考试的时候要准确写名字。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'examination',
    grammarPoints: ['~에', '~(으)ㄹ 때', '~을/를', '~아야/어야 하다'],
    order: 18,
  },
  {
    sentenceNumber: 19,
    koreanText: '어제 바닥에 떨어뜨려서 그런지 휴대폰이 잘 안돼요.',
    mongolianText: 'Өчигдөр шалан дээр унагаасан болохоор утас сайн ажиллахгүй байна.',
    chineseText: '昨天掉在地上了不知是不是这个原因手机不太好用。',
    difficultyLevel: 4,
    kiipLevel: 3,
    category: 'daily-life',
    grammarPoints: ['~에', '~아서/어서 그런지', '~이/가', '~아요/어요'],
    order: 19,
  },
  {
    sentenceNumber: 20,
    koreanText: '비가 와서 그런지 오늘은 길이 많이 막혀요.',
    mongolianText: 'Бороо орсон болохоор өнөөдөр зам их түгжрэлтэй байна.',
    chineseText: '下雨了不知是不是这个原因今天路很堵。',
    difficultyLevel: 3,
    kiipLevel: 2,
    category: 'weather',
    grammarPoints: ['~이/가', '~아서/어서 그런지', '~이/가', '~아요/어요'],
    order: 20,
  },
];

async function seedPronunciationSentences() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing sentences
    await PronunciationTestSentence.deleteMany({});
    console.log('🗑️  Cleared existing pronunciation test sentences');

    // Insert new sentences
    const inserted = await PronunciationTestSentence.insertMany(testSentences);
    console.log(`✅ Successfully seeded ${inserted.length} pronunciation test sentences`);

    // Display summary
    console.log('\n📊 Seeded sentences summary:');
    console.log(`   - Level 0-1 (초급): ${inserted.filter(s => s.kiipLevel <= 1).length} sentences`);
    console.log(`   - Level 2-3 (중급): ${inserted.filter(s => s.kiipLevel >= 2 && s.kiipLevel <= 3).length} sentences`);
    console.log(`   - Level 4-5 (고급): ${inserted.filter(s => s.kiipLevel >= 4).length} sentences`);

    console.log('\n💡 Note: SpeechPro models (GTP/Model) need to be generated for each sentence.');
    console.log('   Use Admin UI or API endpoint: POST /api/pronunciation/test/sentences/:id/generate-model');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pronunciation sentences:', error);
    process.exit(1);
  }
}

// Run seeder
seedPronunciationSentences();
