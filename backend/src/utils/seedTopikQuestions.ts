import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TOPIKQuestion from '../models/TOPIKQuestion';

dotenv.config();

const topikQuestions = [
  // ============================================================
  // TOPIK Level 1 - Reading (초급 읽기)
  // ============================================================
  {
    questionNumber: 1,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 1,
    questionText: '다음 중 맞는 것을 고르십시오.\n\n이것은 ( )입니다.',
    questionTextMn: 'Зөв хариултыг сонгоно уу.\n\nЭнэ ( ) юм.',
    options: [
      { index: 0, text: '책', textMn: 'ном' },
      { index: 1, text: '의자', textMn: 'сандал' },
      { index: 2, text: '연필', textMn: 'харандаа' },
      { index: 3, text: '가방', textMn: 'цүнх' },
    ],
    correctAnswer: 0,
    explanation: '그림에 책이 있으므로 정답은 "책"입니다.',
    explanationMn: 'Зураг дээр ном байгаа тул зөв хариулт нь "책" (ном) юм.',
    points: 1,
    difficultyScore: 20,
  },
  {
    questionNumber: 2,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 1,
    questionText: '빈칸에 들어갈 알맞은 것을 고르십시오.\n\n저는 학생( ).',
    questionTextMn: 'Хоосон зайд тохирох үгийг сонгоно уу.\n\n저는 학생( ).',
    options: [
      { index: 0, text: '이다', textMn: '이다' },
      { index: 1, text: '입니다', textMn: '입니다' },
      { index: 2, text: '이에요', textMn: '이에요' },
      { index: 3, text: '예요', textMn: '예요' },
    ],
    correctAnswer: 1,
    explanation: '존댓말로 "~입니다"를 사용합니다.',
    explanationMn: 'Албан ёсны хэллэгээр "~입니다"-г ашиглана.',
    points: 1,
    difficultyScore: 25,
  },

  // ============================================================
  // TOPIK Level 1 - Listening (초급 듣기)
  // ============================================================
  {
    questionNumber: 3,
    questionType: 'listening-comprehension',
    testSection: 'listening',
    topikLevel: 1,
    questionText: '다음을 듣고 알맞은 그림을 고르십시오.',
    questionTextMn: 'Дараахыг сонсоод тохирох зургийг сонгоно уу.',
    audioUrl: '/uploads/topik/audio/level1_q3.mp3',
    options: [
      { index: 0, text: '책상 위에 책이 있습니다.', textMn: 'Ширээн дээр ном байна.' },
      { index: 1, text: '의자 위에 가방이 있습니다.', textMn: 'Сандал дээр цүнх байна.' },
      { index: 2, text: '창문 옆에 시계가 있습니다.', textMn: 'Цонхны хажууд цаг байна.' },
      { index: 3, text: '벽에 그림이 있습니다.', textMn: 'Хананд зураг байна.' },
    ],
    correctAnswer: 0,
    explanation: '음성: "책상 위에 책이 있습니다."',
    explanationMn: 'Дуу: "책상 위에 책이 있습니다." (Ширээн дээр ном байна.)',
    points: 1,
    difficultyScore: 30,
  },

  // ============================================================
  // TOPIK Level 2 - Reading (초급 읽기)
  // ============================================================
  {
    questionNumber: 4,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 2,
    questionText: '다음을 읽고 중심 생각을 고르십시오.\n\n한국의 여름은 덥고 습합니다. 그래서 여름에는 시원한 음식을 많이 먹습니다. 냉면과 삼계탕이 대표적인 여름 음식입니다.',
    questionTextMn: 'Дараахыг уншаад гол санааг сонгоно уу.\n\n한국의 여름은 덥고 습합니다. 그래서 여름에는 시원한 음식을 많이 먹습니다. 냉면과 삼계탕이 대표적인 여름 음식입니다.',
    options: [
      { index: 0, text: '한국의 여름 날씨', textMn: 'Солонгосын зуны цаг агаар' },
      { index: 1, text: '한국의 여름 음식', textMn: 'Солонгосын зуны хоол' },
      { index: 2, text: '한국의 계절', textMn: 'Солонгосын улирал' },
      { index: 3, text: '냉면 만드는 방법', textMn: 'Хүйтэн гуа хийх арга' },
    ],
    correctAnswer: 1,
    explanation: '이 글은 한국의 여름 음식에 대해 설명하고 있습니다.',
    explanationMn: 'Энэ текст нь Солонгосын зуны хоолны тухай тайлбарлаж байна.',
    points: 2,
    difficultyScore: 40,
  },

  // ============================================================
  // TOPIK Level 3 - Reading (중급 읽기)
  // ============================================================
  {
    questionNumber: 5,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 3,
    questionText: '다음 글의 내용과 같은 것을 고르십시오.\n\n최근 한국에서는 친환경 제품의 인기가 높아지고 있다. 특히 20-30대 젊은 소비자들이 환경 보호에 관심을 가지면서 재활용 가능한 제품이나 유기농 식품을 선호하는 경향이 뚜렷하다. 기업들도 이러한 변화에 발맞춰 친환경 제품 개발에 힘쓰고 있다.',
    questionTextMn: 'Дараах текстийн агуулгатай тохирох хариултыг сонгоно уу.\n\nСүүлийн үед Солонгост байгальд ээлтэй бүтээгдэхүүний эрэлт нэмэгдэж байна. Ялангуяа 20-30 насны залуу хэрэглэгчид байгаль хамгаалалд анхаарч, дахин боловсруулах боломжтой бүтээгдэхүүн болон органик хүнсийг илүүд үзэх хандлага тод ажиглагдаж байна. Компаниуд ч энэ өөрчлөлтөд нийцүүлэн байгальд ээлтэй бүтээгдэхүүн боловсруулахад анхаарч байна.',
    options: [
      {
        index: 0,
        text: '젊은 소비자들이 친환경 제품을 선호한다.',
        textMn: 'Залуу хэрэглэгчид байгальд ээлтэй бүтээгдэхүүнийг илүүд үзнэ.',
      },
      {
        index: 1,
        text: '친환경 제품이 일반 제품보다 싸다.',
        textMn: 'Байгальд ээлтэй бүтээгдэхүүн ердийн бүтээгдэхүүнээс хямд байна.',
      },
      { index: 2, text: '기업들은 친환경 제품을 만들지 않는다.', textMn: 'Компаниуд байгальд ээлтэй бүтээгдэхүүн үйлдвэрлэдэггүй.' },
      { index: 3, text: '유기농 식품은 건강에 해롭다.', textMn: 'Органик хүнс эрүүл мэндэд хортой.' },
    ],
    correctAnswer: 0,
    explanation: '글에서 20-30대 젊은 소비자들이 친환경 제품을 선호한다고 명시되어 있습니다.',
    explanationMn: 'Текстэд 20-30 насны залуу хэрэглэгчид байгальд ээлтэй бүтээгдэхүүнийг илүүд үзнэ гэж тодорхой заасан байна.',
    points: 2,
    difficultyScore: 50,
  },

  // ============================================================
  // TOPIK Level 3 - Listening (중급 듣기)
  // ============================================================
  {
    questionNumber: 6,
    questionType: 'listening-comprehension',
    testSection: 'listening',
    topikLevel: 3,
    questionText: '다음 대화를 듣고 남자가 여자에게 부탁한 것을 고르십시오.',
    questionTextMn: 'Дараах яриаг сонсоод эрэгтэй хүн эмэгтэй хүнээс юу гуйсныг сонгоно уу.',
    audioUrl: '/uploads/topik/audio/level3_q6.mp3',
    options: [
      { index: 0, text: '책을 빌려 달라고 했다.', textMn: 'Ном зээлж өгөхийг гуйсан.' },
      { index: 1, text: '회의 자료를 준비해 달라고 했다.', textMn: 'Хурлын материал бэлтгэхийг гуйсан.' },
      { index: 2, text: '커피를 사 달라고 했다.', textMn: 'Кофе худалдаж авахыг гуйсан.' },
      { index: 3, text: '전화번호를 알려 달라고 했다.', textMn: 'Утасны дугаараа хэлэхийг гуйсан.' },
    ],
    correctAnswer: 1,
    explanation: '대화에서 남자가 여자에게 회의 자료 준비를 부탁했습니다.',
    explanationMn: 'Яриан дээр эрэгтэй хүн эмэгтэй хүнээс хурлын материал бэлтгэхийг гуйсан.',
    points: 2,
    difficultyScore: 55,
  },

  // ============================================================
  // TOPIK Level 4 - Reading (중고급 읽기)
  // ============================================================
  {
    questionNumber: 7,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 4,
    questionText:
      '다음 글에서 <보기>의 문장이 들어가기에 가장 알맞은 곳을 고르십시오.\n\n<보기> 이러한 변화는 사회 전반에 큰 영향을 미치고 있다.\n\n인공지능 기술의 발전은 우리 삶을 빠르게 변화시키고 있다. ( ① ) 특히 의료, 교육, 금융 등 다양한 분야에서 AI가 활용되면서 업무 효율성이 크게 향상되었다. ( ② ) 그러나 일자리 감소나 개인정보 보호 등의 문제도 함께 대두되고 있다. ( ③ ) 따라서 기술 발전과 더불어 이러한 문제들을 해결하기 위한 노력이 필요하다. ( ④ )',
    questionTextMn:
      'Дараах текстэд <보기>-н өгүүлбэрийг хаана оруулах нь хамгийн тохиромжтой вэ?\n\n<보기> Энэ өөрчлөлт нь нийгэмд том нөлөө үзүүлж байна.\n\n인공지능 기술의 발전은 우리 삶을 빠르게 변화시키고 있다. ( ① ) 특히 의료, 교육, 금융 등 다양한 분야에서 AI가 활용되면서 업무 효율성이 크게 향상되었다. ( ② ) 그러나 일자리 감소나 개인정보 보호 등의 문제도 함께 대두되고 있다. ( ③ ) 따라서 기술 발전과 더불어 이러한 문제들을 해결하기 위한 노력이 필요하다. ( ④ )',
    options: [
      { index: 0, text: '①', textMn: '①' },
      { index: 1, text: '②', textMn: '②' },
      { index: 2, text: '③', textMn: '③' },
      { index: 3, text: '④', textMn: '④' },
    ],
    correctAnswer: 2,
    explanation: 'AI의 긍정적, 부정적 영향을 모두 언급한 후 "이러한 변화"라고 종합하는 것이 자연스럽습니다.',
    explanationMn: 'AI-н эерэг, сөрөг нөлөөллийг бүгдийг нь дурдсаны дараа "이러한 변화" (энэ өөрчлөлт) гэж нэгтгэх нь байгалийн юм.',
    points: 3,
    difficultyScore: 65,
  },

  // ============================================================
  // TOPIK Level 4 - Writing (중고급 쓰기)
  // ============================================================
  {
    questionNumber: 8,
    questionType: 'short-answer',
    testSection: 'writing',
    topikLevel: 4,
    questionText: '다음을 읽고 ( )에 들어갈 내용으로 가장 알맞은 것을 쓰십시오. (50-70자)\n\n한국의 전통 명절인 추석에는 (                                    ). 이는 조상에 대한 감사와 가족의 화목을 기원하는 의미가 있다.',
    questionTextMn:
      'Дараахыг уншаад ( )-д оруулах хамгийн тохиромжтой агуулгыг бичнэ үү. (50-70 тэмдэгт)\n\n한국의 전통 명절인 추석에는 (                                    ). 이는 조상에 대한 감사와 가족의 화목을 기원하는 의미가 있다.',
    correctAnswer: '가족들이 모여 차례를 지내고 성묘를 한다',
    explanation: '추석의 대표적인 풍습인 차례와 성묘를 언급해야 합니다.',
    explanationMn: 'Чусогийн үеийн төлөөллийн заншил болох 차례 ба 성묘-г дурдах ёстой.',
    points: 10,
    difficultyScore: 70,
  },

  // ============================================================
  // TOPIK Level 5 - Reading (고급 읽기)
  // ============================================================
  {
    questionNumber: 9,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 5,
    questionText:
      '다음 글의 주제로 가장 알맞은 것을 고르십시오.\n\n현대 사회에서 개인의 정체성은 더 이상 단일하고 고정된 것이 아니다. 세계화와 정보화의 진전으로 개인은 다양한 문화와 가치관에 노출되며, 이를 통해 복합적이고 유동적인 정체성을 형성한다. 특히 디지털 공간에서는 오프라인과는 다른 자아를 표현할 수 있어, 정체성의 다층성이 더욱 두드러진다. 이러한 변화는 전통적인 정체성 개념에 대한 재고를 요구하며, 개인과 사회가 정체성을 이해하고 수용하는 방식에도 영향을 미친다.',
    questionTextMn:
      'Дараах текстийн сэдвийг хамгийн тохирохоор сонгоно уу.\n\n현대 사회에서 개인의 정체성은 더 이상 단일하고 고정된 것이 아니다. 세계화와 정보화의 진전으로 개인은 다양한 문화와 가치관에 노출되며, 이를 통해 복합적이고 유동적인 정체성을 형성한다. 특히 디지털 공간에서는 오프라인과는 다른 자아를 표현할 수 있어, 정체성의 다층성이 더욱 두드러진다. 이러한 변화는 전통적인 정체성 개념에 대한 재고를 요구하며, 개인과 사회가 정체성을 이해하고 수용하는 방식에도 영향을 미친다.',
    options: [
      { index: 0, text: '세계화가 문화에 미치는 영향', textMn: 'Даяаршлын соёлд үзүүлэх нөлөө' },
      { index: 1, text: '디지털 기술의 발전', textMn: 'Дижитал технологийн хөгжил' },
      { index: 2, text: '현대 사회에서 정체성의 변화', textMn: 'Орчин үеийн нийгэмд хувийн онцлогийн өөрчлөлт' },
      { index: 3, text: '전통 문화의 중요성', textMn: 'Уламжлалт соёлын ач холбогдол' },
    ],
    correctAnswer: 2,
    explanation: '이 글은 현대 사회에서 개인의 정체성이 어떻게 변화하고 있는지에 대해 논하고 있습니다.',
    explanationMn: 'Энэ текст нь орчин үеийн нийгэмд хувь хүний онцлог хэрхэн өөрчлөгдөж байгаа талаар ярьж байна.',
    points: 3,
    difficultyScore: 80,
  },

  // ============================================================
  // TOPIK Level 5 - Writing (고급 쓰기)
  // ============================================================
  {
    questionNumber: 10,
    questionType: 'essay',
    testSection: 'writing',
    topikLevel: 5,
    questionText:
      '다음 주제에 대해 자신의 의견을 600-700자로 쓰십시오.\n\n주제: 인공지능의 발전이 사회에 미치는 긍정적 영향과 부정적 영향에 대해 논하고, 바람직한 발전 방향을 제시하십시오.',
    questionTextMn:
      'Дараах сэдвээр өөрийн бодлоо 600-700 тэмдэгтээр бичнэ үү.\n\n주제: 인공지능의 발전이 사회에 미치는 긍정적 영향과 부정적 영향에 대해 논하고, 바람직한 발전 방향을 제시하십시오.',
    correctAnswer: '',
    explanation: '서론-본론(긍정적 영향, 부정적 영향)-결론(발전 방향) 구조로 논리적으로 작성해야 합니다.',
    explanationMn: 'Оршил-үндсэн хэсэг (эерэг нөлөө, сөрөг нөлөө)-дүгнэлт (хөгжлийн чиглэл) бүтэцтэй логик байдлаар бичих ёстой.',
    points: 50,
    difficultyScore: 90,
  },

  // ============================================================
  // TOPIK Level 6 - Reading (최고급 읽기)
  // ============================================================
  {
    questionNumber: 11,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 6,
    questionText:
      '다음 글의 내용과 일치하지 않는 것을 고르십시오.\n\n한국의 한옥은 단순히 거주 공간을 넘어 자연과의 조화를 추구하는 철학적 사상을 담고 있다. 한옥의 구조는 계절의 변화에 따라 자연스럽게 대응할 수 있도록 설계되었으며, 처마의 깊이와 방향은 여름과 겨울의 태양 고도를 고려하여 결정되었다. 또한 마당과 대청마루는 내부와 외부 공간을 유기적으로 연결하여 자연과의 소통을 가능하게 한다. 최근에는 이러한 한옥의 친환경적 특성이 재평가되면서 현대 건축에 한옥의 요소를 접목하려는 시도가 증가하고 있다.',
    questionTextMn:
      'Дараах текстийн агуулгатай тохирохгүй зүйлийг сонгоно уу.\n\n한국의 한옥은 단순히 거주 공간을 넘어 자연과의 조화를 추구하는 철학적 사상을 담고 있다. 한옥의 구조는 계절의 변화에 따라 자연스럽게 대응할 수 있도록 설계되었으며, 처마의 깊이와 방향은 여름과 겨울의 태양 고도를 고려하여 결정되었다. 또한 마당과 대청마루는 내부와 외부 공간을 유기적으로 연결하여 자연과의 소통을 가능하게 한다. 최근에는 이러한 한옥의 친환경적 특성이 재평가되면서 현대 건축에 한옥의 요소를 접목하려는 시도가 증가하고 있다.',
    options: [
      { index: 0, text: '한옥은 자연과의 조화를 중시한다.', textMn: 'Ханок нь байгальтай уялдаа холбоог эрхэмлэдэг.' },
      { index: 1, text: '처마의 설계는 태양의 위치를 고려한다.', textMn: 'Дээврийн загвар нь нарны байрлалыг тооцдог.' },
      {
        index: 2,
        text: '한옥은 현대 건축보다 비용이 저렴하다.',
        textMn: 'Ханок нь орчин үеийн барилгаас хямд өртөгтэй.',
      },
      {
        index: 3,
        text: '현대 건축에 한옥의 요소를 적용하려는 노력이 있다.',
        textMn: 'Орчин үеийн барилгад ханокийн элементүүдийг ашиглах оролдлого байна.',
      },
    ],
    correctAnswer: 2,
    explanation: '글에서 한옥의 비용에 대한 언급은 없습니다.',
    explanationMn: 'Текстэд ханокийн өртгийн тухай дурдаагүй байна.',
    points: 3,
    difficultyScore: 95,
  },

  // ============================================================
  // TOPIK Level 6 - Writing (최고급 쓰기)
  // ============================================================
  {
    questionNumber: 12,
    questionType: 'essay',
    testSection: 'writing',
    topikLevel: 6,
    questionText:
      '다음 자료를 참고하여 "디지털 시대의 독서 문화 변화와 그 의미"에 대한 글을 700-800자로 쓰십시오.\n\n[자료 1] 전자책 시장 성장률 (2020-2024): 연평균 15% 증가\n[자료 2] 종이책 판매량 감소율: 연평균 8% 감소\n[자료 3] 독서 시간 변화: 하루 평균 30분 → 20분으로 감소\n\n글에는 다음 내용이 포함되어야 합니다:\n1) 디지털 시대 독서 문화의 변화 양상\n2) 이러한 변화가 가져오는 긍정적/부정적 영향\n3) 바람직한 독서 문화 정착을 위한 방안',
    questionTextMn:
      'Дараах мэдээллийг ашиглан "Дижитал эрин үеийн уншлагын соёлын өөрчлөлт ба түүний утга" сэдвээр 700-800 тэмдэгтээр бичнэ үү.\n\n[자료 1] 전자책 시장 성장률 (2020-2024): 연평균 15% 증가\n[자료 2] 종이책 판매량 감소율: 연평균 8% 감소\n[자료 3] 독서 시간 변화: 하루 평균 30분 → 20분으로 감소\n\n글에는 다음 내용이 포함되어야 합니다:\n1) 디지털 시대 독서 문화의 변화 양상\n2) 이러한 변화가 가져오는 긍정적/부정적 영향\n3) 바람직한 독서 문화 정착을 위한 방안',
    correctAnswer: '',
    explanation: '제시된 자료를 활용하여 논리적으로 전개하고, 세 가지 요구사항을 모두 포함해야 합니다.',
    explanationMn:
      'Өгөгдсөн мэдээллийг ашиглан логик байдлаар хөгжүүлж, гурван шаардлагыг бүгдийг нь багтаасан байх ёстой.',
    points: 50,
    difficultyScore: 98,
  },

  // ============================================================
  // Additional Reading Questions for Level 2
  // ============================================================
  {
    questionNumber: 13,
    questionType: 'multiple-choice',
    testSection: 'reading',
    topikLevel: 2,
    questionText: '다음 문장의 의미로 알맞은 것을 고르십시오.\n\n"비가 와서 소풍을 가지 못했습니다."',
    questionTextMn: 'Дараах өгүүлбэрийн утгыг зөв сонгоно уу.\n\n"비가 와서 소풍을 가지 못했습니다."',
    options: [
      { index: 0, text: '비가 오면 소풍을 갈 것이다.', textMn: 'Бороо орвол зугаалгаанд явна.' },
      { index: 1, text: '비가 왔기 때문에 소풍을 가지 못했다.', textMn: 'Бороо орсон учраас зугаалгаанд явсангүй.' },
      { index: 2, text: '비가 와도 소풍을 갔다.', textMn: 'Бороо орсон ч зугаалгаанд явсан.' },
      { index: 3, text: '소풍을 가려고 비를 기다렸다.', textMn: 'Зугаалгаанд явахын тулд бороо хүлээсэн.' },
    ],
    correctAnswer: 1,
    explanation: '"~아서/어서"는 이유를 나타냅니다.',
    explanationMn: '"~아서/어서" нь шалтгааныг илэрхийлнэ.',
    points: 2,
    difficultyScore: 35,
  },

  // ============================================================
  // Additional Listening Questions for Level 2
  // ============================================================
  {
    questionNumber: 14,
    questionType: 'listening-comprehension',
    testSection: 'listening',
    topikLevel: 2,
    questionText: '다음을 듣고 여자가 주말에 할 일을 고르십시오.',
    questionTextMn: 'Дараахыг сонсоод эмэгтэй хүн амралтын өдөр юу хийхийг сонгоно уу.',
    audioUrl: '/uploads/topik/audio/level2_q14.mp3',
    options: [
      { index: 0, text: '영화를 보러 갑니다.', textMn: 'Кино үзэхээр явна.' },
      { index: 1, text: '도서관에서 공부합니다.', textMn: 'Номын санд суралцана.' },
      { index: 2, text: '친구를 만나러 갑니다.', textMn: 'Найзтайгаа уулзахаар явна.' },
      { index: 3, text: '집에서 쉽니다.', textMn: 'Гэртээ амрана.' },
    ],
    correctAnswer: 2,
    explanation: '대화에서 여자가 주말에 친구를 만나기로 했다고 말합니다.',
    explanationMn: 'Яриан дээр эмэгтэй хүн амралтын өдөр найзтайгаа уулзахаар болсон гэж хэлсэн.',
    points: 2,
    difficultyScore: 38,
  },

  // ============================================================
  // Additional Writing Questions for Level 3
  // ============================================================
  {
    questionNumber: 15,
    questionType: 'short-answer',
    testSection: 'writing',
    topikLevel: 3,
    questionText: '다음 상황에 맞게 200-300자로 이메일을 작성하십시오.\n\n상황: 회사 동료에게 내일 회의 시간 변경을 요청하는 이메일',
    questionTextMn:
      'Дараах нөхцөл байдалд тохирохоор 200-300 тэмдэгтээр имэйл бичнэ үү.\n\n상황: 회사 동료에게 내일 회의 시간 변경을 요청하는 이메일',
    correctAnswer: '',
    explanation: '정중한 표현을 사용하고, 시간 변경의 이유와 대안을 제시해야 합니다.',
    explanationMn: 'Эелдэг хэллэг ашиглаж, цаг өөрчлөх шалтгаан болон өөр хувилбарыг санал болгох ёстой.',
    points: 20,
    difficultyScore: 60,
  },
];

async function seedTopikQuestions() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing TOPIK questions
    await TOPIKQuestion.deleteMany({});
    console.log('Existing TOPIK questions cleared');

    // Insert TOPIK questions
    const result = await TOPIKQuestion.insertMany(topikQuestions);
    console.log(`✅ Successfully seeded ${result.length} TOPIK questions`);

    // Display statistics by level and section
    const levels = [1, 2, 3, 4, 5, 6];
    const sections = ['listening', 'reading', 'writing'];

    console.log('\n📊 Question Distribution:');
    console.log('─'.repeat(60));

    for (const level of levels) {
      const levelQuestions = result.filter((q) => q.topikLevel === level);
      console.log(`\n🎯 TOPIK Level ${level}: ${levelQuestions.length} questions`);

      for (const section of sections) {
        const sectionQuestions = levelQuestions.filter((q) => q.testSection === section);
        if (sectionQuestions.length > 0) {
          const sectionName =
            section === 'listening' ? '듣기' : section === 'reading' ? '읽기' : '쓰기';
          console.log(`   - ${sectionName}: ${sectionQuestions.length} questions`);
        }
      }
    }

    console.log('\n─'.repeat(60));
    console.log('✅ TOPIK question seeding completed successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding TOPIK questions:', error);
    process.exit(1);
  }
}

seedTopikQuestions();
