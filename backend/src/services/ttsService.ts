import axios from 'axios';
import fs from 'fs';
import path from 'path';

const TTS_API_URL = process.env.TTS_API_URL || 'http://localhost:8000/tts';
const TTS_API_KEY = process.env.TTS_API_KEY || '';
const TTS_DEFAULT_VOICE = process.env.TTS_DEFAULT_VOICE || 'ko-KR-Wavenet-A';
const TTS_DEFAULT_SPEED = parseFloat(process.env.TTS_DEFAULT_SPEED || '1.0');
const TTS_DEFAULT_PITCH = parseFloat(process.env.TTS_DEFAULT_PITCH || '0.0');
const TTS_OUTPUT_FORMAT = process.env.TTS_OUTPUT_FORMAT || 'mp3';
const AI_AUDIO_UPLOAD_PATH = process.env.AI_AUDIO_UPLOAD_PATH || './uploads/tts';

// Ensure upload directory exists
if (!fs.existsSync(AI_AUDIO_UPLOAD_PATH)) {
  fs.mkdirSync(AI_AUDIO_UPLOAD_PATH, { recursive: true });
}

interface TTSRequest {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
  outputFormat?: string;
}

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  audioData?: Buffer;
  duration?: number;
  fileSize?: number;
  error?: string;
}

/**
 * TTS API에 요청을 보내는 기본 함수
 */
const callTTSAPI = async (request: TTSRequest): Promise<Buffer> => {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (TTS_API_KEY) {
      headers['Authorization'] = `Bearer ${TTS_API_KEY}`;
    }

    const response = await axios.post(
      TTS_API_URL,
      {
        text: request.text,
        voice: request.voice || TTS_DEFAULT_VOICE,
        speed: request.speed || TTS_DEFAULT_SPEED,
        pitch: request.pitch || TTS_DEFAULT_PITCH,
        outputFormat: request.outputFormat || TTS_OUTPUT_FORMAT,
      },
      {
        headers,
        responseType: 'arraybuffer',
        timeout: 30000, // 30 seconds
      }
    );

    return Buffer.from(response.data);
  } catch (error: any) {
    console.error('TTS API Error:', error.message);
    throw new Error(`TTS 서비스 오류: ${error.message}`);
  }
};

/**
 * 텍스트를 음성으로 변환하고 파일로 저장
 */
export const generateAudio = async (
  text: string,
  options: {
    voice?: string;
    speed?: number;
    pitch?: number;
    wordId?: string;
    audioType?: 'word' | 'example' | 'phoneme_rule';
  } = {}
): Promise<TTSResponse> => {
  try {
    const audioBuffer = await callTTSAPI({
      text,
      voice: options.voice,
      speed: options.speed,
      pitch: options.pitch,
      outputFormat: TTS_OUTPUT_FORMAT,
    });

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const prefix = options.wordId || 'audio';
    const fileName = `${prefix}_${timestamp}_${random}.${TTS_OUTPUT_FORMAT}`;
    const filePath = path.join(AI_AUDIO_UPLOAD_PATH, fileName);

    // Save audio file
    fs.writeFileSync(filePath, audioBuffer);

    const fileSize = fs.statSync(filePath).size;

    return {
      success: true,
      audioUrl: `/uploads/tts/${fileName}`,
      fileSize,
      duration: 0, // TODO: Calculate actual duration if needed
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 단어 발음 오디오 생성
 */
export const generateWordAudio = async (
  koreanWord: string,
  wordId?: string,
  options: { voice?: string; speed?: number; pitch?: number } = {}
): Promise<TTSResponse> => {
  return generateAudio(koreanWord, {
    ...options,
    wordId,
    audioType: 'word',
  });
};

/**
 * 예문 오디오 생성
 */
export const generateExampleAudio = async (
  exampleText: string,
  wordId?: string,
  options: { voice?: string; speed?: number; pitch?: number } = {}
): Promise<TTSResponse> => {
  return generateAudio(exampleText, {
    ...options,
    wordId,
    audioType: 'example',
  });
};

/**
 * 발음 규칙 오디오 생성
 */
export const generatePhonemeRuleAudio = async (
  ruleText: string,
  options: { voice?: string; speed?: number; pitch?: number } = {}
): Promise<TTSResponse> => {
  return generateAudio(ruleText, {
    ...options,
    audioType: 'phoneme_rule',
  });
};

/**
 * 실시간 TTS (파일 저장 없이 바로 반환)
 */
export const generateRealTimeTTS = async (
  text: string,
  options: { voice?: string; speed?: number; pitch?: number } = {}
): Promise<Buffer> => {
  return callTTSAPI({
    text,
    voice: options.voice,
    speed: options.speed,
    pitch: options.pitch,
  });
};

/**
 * 여러 텍스트를 일괄 처리
 */
export const generateBatchAudio = async (
  texts: Array<{ text: string; id?: string }>,
  options: { voice?: string; speed?: number; pitch?: number } = {}
): Promise<Array<TTSResponse>> => {
  const results: Array<TTSResponse> = [];

  for (const item of texts) {
    try {
      const result = await generateAudio(item.text, {
        ...options,
        wordId: item.id,
      });
      results.push(result);

      // Add small delay to avoid overwhelming the TTS server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      results.push({
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * TTS 서비스 연결 테스트
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Test with a simple Korean phrase
    const testText = '안녕하세요';
    const buffer = await callTTSAPI({
      text: testText,
      voice: TTS_DEFAULT_VOICE,
    });

    if (buffer && buffer.length > 0) {
      return {
        success: true,
        message: `TTS 서비스 연결 성공! (테스트 오디오 크기: ${buffer.length} bytes)`,
      };
    }

    return {
      success: false,
      message: 'TTS 응답이 비어있습니다.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `TTS 서비스 연결 실패: ${error.message}`,
    };
  }
};

/**
 * 저장된 오디오 파일 삭제
 */
export const deleteAudioFile = async (audioUrl: string): Promise<boolean> => {
  try {
    const fileName = audioUrl.replace('/uploads/tts/', '');
    const filePath = path.join(AI_AUDIO_UPLOAD_PATH, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error: any) {
    console.error('Delete audio file error:', error);
    return false;
  }
};
