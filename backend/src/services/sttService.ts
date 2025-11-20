import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const STT_API_URL = process.env.STT_API_URL || 'http://localhost:9000/stt';
const STT_API_KEY = process.env.STT_API_KEY || '';
const STT_LANGUAGE = process.env.STT_LANGUAGE || 'ko-KR';
const STT_ACCURACY_THRESHOLD = parseFloat(process.env.STT_ACCURACY_THRESHOLD || '0.7');

interface STTRequest {
  audioFile: Buffer | string; // Buffer or file path
  language?: string;
  expectedText?: string;
}

interface STTResponse {
  success: boolean;
  recognizedText?: string;
  confidence?: number;
  error?: string;
}

interface PronunciationEvaluationResult {
  recognizedText: string;
  expectedText: string;
  accuracyScore: number;
  feedback: string;
  feedbackMn: string;
  detailedScores?: {
    pronunciation: number;
    fluency: number;
    completeness: number;
  };
}

/**
 * STT API에 요청을 보내는 기본 함수
 */
const callSTTAPI = async (request: STTRequest): Promise<STTResponse> => {
  try {
    const formData = new FormData();

    // Add audio file to form data
    if (Buffer.isBuffer(request.audioFile)) {
      formData.append('audio', request.audioFile, {
        filename: 'audio.webm',
        contentType: 'audio/webm',
      });
    } else {
      formData.append('audio', fs.createReadStream(request.audioFile));
    }

    // Add other parameters
    formData.append('language', request.language || STT_LANGUAGE);
    if (request.expectedText) {
      formData.append('expectedText', request.expectedText);
    }

    const headers: any = formData.getHeaders();
    if (STT_API_KEY) {
      headers['Authorization'] = `Bearer ${STT_API_KEY}`;
    }

    const response = await axios.post(STT_API_URL, formData, {
      headers,
      timeout: 30000, // 30 seconds
    });

    return {
      success: true,
      recognizedText: response.data.text || response.data.recognizedText || '',
      confidence: response.data.confidence || 1.0,
    };
  } catch (error: any) {
    console.error('STT API Error:', error.message);
    return {
      success: false,
      error: `STT 서비스 오류: ${error.message}`,
    };
  }
};

/**
 * 음성을 텍스트로 변환
 */
export const transcribeAudio = async (
  audioFile: Buffer | string,
  language?: string
): Promise<STTResponse> => {
  return callSTTAPI({
    audioFile,
    language,
  });
};

/**
 * 발음 평가 (사용자 음성과 예상 텍스트 비교)
 */
export const evaluatePronunciation = async (
  audioFile: Buffer | string,
  expectedText: string,
  language?: string
): Promise<PronunciationEvaluationResult> => {
  const sttResult = await callSTTAPI({
    audioFile,
    expectedText,
    language,
  });

  if (!sttResult.success || !sttResult.recognizedText) {
    throw new Error(sttResult.error || '음성 인식에 실패했습니다.');
  }

  const recognizedText = sttResult.recognizedText.trim();
  const expected = expectedText.trim();

  // Calculate accuracy score
  const accuracyScore = calculateAccuracyScore(recognizedText, expected);

  // Generate feedback based on accuracy
  const feedback = generateFeedback(accuracyScore, recognizedText, expected);
  const feedbackMn = generateFeedbackMn(accuracyScore, recognizedText, expected);

  // Calculate detailed scores
  const detailedScores = {
    pronunciation: accuracyScore,
    fluency: sttResult.confidence || 0.8,
    completeness: calculateCompleteness(recognizedText, expected),
  };

  return {
    recognizedText,
    expectedText: expected,
    accuracyScore,
    feedback,
    feedbackMn,
    detailedScores,
  };
};

/**
 * 정확도 점수 계산 (Levenshtein distance 기반)
 */
const calculateAccuracyScore = (recognized: string, expected: string): number => {
  // Remove spaces for comparison
  const rec = recognized.replace(/\s/g, '');
  const exp = expected.replace(/\s/g, '');

  const distance = levenshteinDistance(rec, exp);
  const maxLength = Math.max(rec.length, exp.length);

  if (maxLength === 0) return 1.0;

  const score = Math.max(0, 1 - distance / maxLength);
  return Math.round(score * 100) / 100; // Round to 2 decimal places
};

/**
 * Levenshtein distance 계산
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
};

/**
 * 완전성 점수 계산
 */
const calculateCompleteness = (recognized: string, expected: string): number => {
  const recWords = recognized.split(/\s+/).filter(w => w.length > 0);
  const expWords = expected.split(/\s+/).filter(w => w.length > 0);

  if (expWords.length === 0) return 1.0;

  const matchCount = expWords.filter(word => recognized.includes(word)).length;
  return Math.round((matchCount / expWords.length) * 100) / 100;
};

/**
 * 피드백 생성 (한국어)
 */
const generateFeedback = (score: number, recognized: string, expected: string): string => {
  if (score >= 0.9) {
    return '완벽합니다! 발음이 매우 정확합니다. 계속 좋은 연습을 하고 계십니다.';
  } else if (score >= 0.7) {
    return '잘하셨습니다! 대부분의 발음이 정확합니다. 조금 더 연습하면 완벽할 것입니다.';
  } else if (score >= 0.5) {
    return '괜찮은 시도입니다. 발음을 조금 더 명확하게 해보세요. 천천히 연습하면 좋아질 것입니다.';
  } else if (score >= 0.3) {
    return '더 연습이 필요합니다. 각 음절을 천천히 또박또박 발음해보세요. 듣고 따라하기를 반복하세요.';
  } else {
    return '많은 연습이 필요합니다. 표준 발음을 여러 번 들어보시고, 천천히 따라 말해보세요.';
  }
};

/**
 * 피드백 생성 (몽골어)
 */
const generateFeedbackMn = (score: number, recognized: string, expected: string): string => {
  if (score >= 0.9) {
    return 'Төгс байна! Дуудлага маш нарийвчлалтай байна. Сайн дасгал хийж байна.';
  } else if (score >= 0.7) {
    return 'Сайн байна! Дуудлагын ихэнх хэсэг нь зөв байна. Бага зэрэг дасгал хийвэл төгс болно.';
  } else if (score >= 0.5) {
    return 'Сайн оролдлого. Дуудлагыг бага зэрэг тодорхой хэлээрэй. Удаан дасгалжвал сайжирна.';
  } else if (score >= 0.3) {
    return 'Илүү дасгал хэрэгтэй. Үе бүрийг удаан тодорхой дуудаарай. Сонсож дараад давтаарай.';
  } else {
    return 'Олон дасгал хэрэгтэй. Стандарт дуудлагыг олон удаа сонсоод, удаан дараад хэлээрэй.';
  }
};

/**
 * STT 서비스 연결 테스트
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a simple test buffer (silence)
    const testBuffer = Buffer.alloc(1000);

    const response = await axios.post(
      STT_API_URL,
      { test: true },
      {
        headers: STT_API_KEY ? { Authorization: `Bearer ${STT_API_KEY}` } : {},
        timeout: 5000,
      }
    );

    return {
      success: true,
      message: 'STT 서비스 연결 성공!',
    };
  } catch (error: any) {
    // If endpoint doesn't support test mode, try with actual request
    if (error.response?.status === 400 || error.response?.status === 422) {
      return {
        success: true,
        message: 'STT 서비스가 실행 중입니다. (테스트 모드 미지원)',
      };
    }

    return {
      success: false,
      message: `STT 서비스 연결 실패: ${error.message}`,
    };
  }
};
