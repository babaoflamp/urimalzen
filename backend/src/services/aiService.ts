import axios from 'axios';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
const OLLAMA_TEMPERATURE = parseFloat(process.env.OLLAMA_TEMPERATURE || '0.7');
const OLLAMA_MAX_TOKENS = parseInt(process.env.OLLAMA_MAX_TOKENS || '2000');

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Ollama API에 요청을 보내는 기본 함수
 */
const callOllama = async (prompt: string): Promise<string> => {
  try {
    const requestBody: OllamaRequest = {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: OLLAMA_TEMPERATURE,
        num_predict: OLLAMA_MAX_TOKENS,
      },
    };

    const response = await axios.post<OllamaResponse>(
      `${OLLAMA_API_URL}/generate`,
      requestBody,
      {
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response.data.response.trim();
  } catch (error: any) {
    console.error('Ollama API Error:', error.message);
    throw new Error(`AI 서비스 오류: ${error.message}`);
  }
};

/**
 * 단어 설명을 AI로 생성
 */
export const generateWordDescription = async (
  koreanWord: string,
  language: 'ko' | 'mn' | 'both' = 'ko'
): Promise<{ ko?: string; mn?: string }> => {
  const result: { ko?: string; mn?: string } = {};

  if (language === 'ko' || language === 'both') {
    const promptKo = `한국어 단어 "${koreanWord}"에 대한 명확하고 이해하기 쉬운 설명을 2-3문장으로 작성해주세요. 초급 학습자도 이해할 수 있도록 쉬운 용어를 사용하세요.`;
    result.ko = await callOllama(promptKo);
  }

  if (language === 'mn' || language === 'both') {
    const promptMn = `"${koreanWord}" гэсэн солонгос үгийн тайлбарыг монгол хэл дээр 2-3 өгүүлбэрээр бичнэ үү. Анхан шатны суралцагчид ойлгохуйц хялбар үг хэрэглэнэ үү.`;
    result.mn = await callOllama(promptMn);
  }

  return result;
};

/**
 * 예문을 AI로 생성
 */
export const generateExamples = async (
  koreanWord: string,
  count: number = 3
): Promise<Array<{ korean: string; mongolian: string }>> => {
  const promptKo = `한국어 단어 "${koreanWord}"를 사용한 ${count}개의 실생활 예문을 작성해주세요. 각 예문은 한 줄로 작성하고, 번호를 붙여서 작성하세요. (1. ... 2. ... 3. ...)`;

  const koreanExamples = await callOllama(promptKo);
  const koreanLines = koreanExamples.split('\n').filter(line => line.trim().match(/^\d+\./));

  const examples: Array<{ korean: string; mongolian: string }> = [];

  for (const line of koreanLines.slice(0, count)) {
    const korean = line.replace(/^\d+\.\s*/, '').trim();

    // 각 예문을 몽골어로 번역
    const promptMn = `다음 한국어 문장을 몽골어로 번역해주세요: "${korean}"`;
    const mongolian = await callOllama(promptMn);

    examples.push({ korean, mongolian: mongolian.trim() });
  }

  return examples;
};

/**
 * 발음 팁을 AI로 생성
 */
export const generatePronunciationTips = async (
  koreanWord: string,
  language: 'ko' | 'mn' | 'both' = 'ko'
): Promise<{ ko?: string; mn?: string }> => {
  const result: { ko?: string; mn?: string } = {};

  if (language === 'ko' || language === 'both') {
    const promptKo = `한국어 단어 "${koreanWord}"의 발음 주의사항과 팁을 2-3문장으로 작성해주세요. 특히 외국인 학습자가 어려워할 수 있는 부분을 중심으로 설명하세요.`;
    result.ko = await callOllama(promptKo);
  }

  if (language === 'mn' || language === 'both') {
    const promptMn = `"${koreanWord}" гэсэн үгийн дуудлагын зөвлөмжийг монгол хэл дээр 2-3 өгүүлбэрээр бичнэ үү. Гадаадын суралцагчид хэцүү санагдах хэсгүүдэд анхаарна уу.`;
    result.mn = await callOllama(promptMn);
  }

  return result;
};

/**
 * 학습 콘텐츠 전체 생성 (설명 + 예문 + 발음 팁)
 */
export const generateFullContent = async (
  koreanWord: string,
  language: 'ko' | 'mn' | 'both' = 'both'
): Promise<{
  description?: { ko?: string; mn?: string };
  examples?: Array<{ korean: string; mongolian: string }>;
  pronunciationTips?: { ko?: string; mn?: string };
}> => {
  try {
    const [description, examples, pronunciationTips] = await Promise.all([
      generateWordDescription(koreanWord, language),
      generateExamples(koreanWord, 3),
      generatePronunciationTips(koreanWord, language),
    ]);

    return {
      description,
      examples,
      pronunciationTips,
    };
  } catch (error: any) {
    console.error('Full content generation error:', error);
    throw error;
  }
};

/**
 * 학습 유닛/레슨 설명 생성
 */
export const generateLessonContent = async (
  title: string,
  words: string[],
  language: 'ko' | 'mn' = 'ko'
): Promise<string> => {
  const wordList = words.join(', ');

  let prompt = '';
  if (language === 'ko') {
    prompt = `"${title}"이라는 주제로 다음 단어들을 포함한 한국어 학습 콘텐츠를 작성해주세요: ${wordList}.
학습 목표와 핵심 내용을 3-4문단으로 작성하세요.`;
  } else {
    prompt = `"${title}" сэдвээр дараах үгсийг агуулсан солонгос хэл сургалтын контент бичнэ үү: ${wordList}.
Сургалтын зорилго болон гол агуулгыг 3-4 догол мөрөөр бичнэ үү.`;
  }

  return await callOllama(prompt);
};

/**
 * AI 서비스 연결 테스트
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL.replace('/api', '')}/api/tags`);

    const models = response.data.models || [];
    const hasModel = models.some((m: any) => m.name === OLLAMA_MODEL);

    if (!hasModel) {
      return {
        success: false,
        message: `모델 "${OLLAMA_MODEL}"을 찾을 수 없습니다. ollama pull ${OLLAMA_MODEL} 명령어로 모델을 다운로드하세요.`,
      };
    }

    return {
      success: true,
      message: `Ollama 연결 성공! 모델: ${OLLAMA_MODEL}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Ollama 연결 실패: ${error.message}`,
    };
  }
};
