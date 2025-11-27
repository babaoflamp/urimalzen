import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category';

dotenv.config();

/**
 * 기존 카테고리 데이터에 중국어 번역 추가
 */
const chineseTranslations = [
  {
    name: '인간',
    nameCn: '人类',
    descriptionCn: '身体部位、情感、性格、感官、生命周期',
  },
  {
    name: '식생활',
    nameCn: '饮食生活',
    descriptionCn: '食材、烹饪方法、食物味道、用餐礼仪、外出就餐文化',
  },
  {
    name: '의생활',
    nameCn: '服装生活',
    descriptionCn: '服装类型、穿戴动词、时尚、季节性服装',
  },
  {
    name: '주생활',
    nameCn: '居住生活',
    descriptionCn: '住宅类型、家具和家电、租赁合同、房屋维修',
  },
  {
    name: '건강과 안전',
    nameCn: '健康与安全',
    descriptionCn: '疾病和症状、医院和药店使用、急救、卫生、灾害安全',
  },
  {
    name: '교육',
    nameCn: '教育',
    descriptionCn: '学校制度、学习工具、考试和评估、入学和毕业、韩语学习',
  },
  {
    name: '직업과 일',
    nameCn: '职业与工作',
    descriptionCn: '职业类型、职场生活、工作条件、业务执行、求职活动',
  },
  {
    name: '여가와 취미',
    nameCn: '休闲与爱好',
    descriptionCn: '体育、旅行、文化观赏、爱好活动、假日和休假',
  },
  {
    name: '경제 생활',
    nameCn: '经济生活',
    descriptionCn: '购物、银行业务、价格谈判、储蓄和投资、消费习惯',
  },
  {
    name: '교통과 이동',
    nameCn: '交通与出行',
    descriptionCn: '公共交通、驾驶、问路、交通规则、车辆维护',
  },
  {
    name: '인간관계와 소통',
    nameCn: '人际关系与沟通',
    descriptionCn: '家庭关系、朋友关系、社交礼仪、沟通方式、感谢和道歉',
  },
  {
    name: '자연과 환경',
    nameCn: '自然与环境',
    descriptionCn: '天气和气候、季节、动植物、地理、环境保护',
  },
  {
    name: '장소와 지역',
    nameCn: '地点与地区',
    descriptionCn: '建筑物、公共场所、城市和乡村、行政区域、旅游景点',
  },
  {
    name: '문화와 예술',
    nameCn: '文化与艺术',
    descriptionCn: '韩国传统文化、现代文化、艺术活动、节日、礼仪和习俗',
  },
];

const updateCategoriesWithChinese = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen');
    console.log('✅ MongoDB 연결 성공');

    let updateCount = 0;

    for (const translation of chineseTranslations) {
      const result = await Category.updateOne(
        { name: translation.name },
        {
          $set: {
            nameCn: translation.nameCn,
            descriptionCn: translation.descriptionCn,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ "${translation.name}" 카테고리에 중국어 번역 추가됨`);
        updateCount++;
      }
    }

    console.log(`\n✅ 총 ${updateCount}개 카테고리에 중국어 번역이 추가되었습니다.`);

    await mongoose.connection.close();
    console.log('✅ MongoDB 연결 종료');
  } catch (error) {
    console.error('❌ 카테고리 업데이트 실패:', error);
    process.exit(1);
  }
};

// Run the update
updateCategoriesWithChinese();
