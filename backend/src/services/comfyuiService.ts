import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const COMFYUI_API_URL = process.env.COMFYUI_API_URL || 'http://localhost:8188';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const COMFYUI_IMAGES_DIR = path.join(UPLOAD_DIR, 'comfyui');

// ComfyUI 이미지 저장 디렉토리 생성
if (!fs.existsSync(COMFYUI_IMAGES_DIR)) {
  fs.mkdirSync(COMFYUI_IMAGES_DIR, { recursive: true });
}

interface ComfyUIPromptRequest {
  prompt: {
    [key: string]: any;
  };
  client_id?: string;
}

interface ComfyUIPromptResponse {
  prompt_id: string;
  number: number;
  node_errors?: any;
}

interface ComfyUIHistoryResponse {
  [prompt_id: string]: {
    outputs: {
      [node_id: string]: {
        images?: Array<{
          filename: string;
          subfolder: string;
          type: string;
        }>;
      };
    };
    status: {
      status_str: string;
      completed: boolean;
    };
  };
}

/**
 * ComfyUI 기본 워크플로우 템플릿
 * 텍스트 프롬프트로 이미지 생성
 */
const getBasicWorkflow = (
  positivePrompt: string,
  negativePrompt: string = 'low quality, blurry, distorted',
  width: number = 512,
  height: number = 512,
  steps: number = 20,
  seed: number = Math.floor(Math.random() * 1000000)
) => {
  // seed가 -1이면 랜덤 seed 생성
  const actualSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
  
  return {
    "3": {
      "inputs": {
        "seed": actualSeed,
        "steps": steps,
        "cfg": 7,
        "sampler_name": "euler",
        "scheduler": "normal",
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      },
      "class_type": "KSampler"
    },
    "4": {
      "inputs": {
        "ckpt_name": "sd_xl_base_1.0.safetensors"
      },
      "class_type": "CheckpointLoaderSimple"
    },
    "5": {
      "inputs": {
        "width": width,
        "height": height,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage"
    },
    "6": {
      "inputs": {
        "text": positivePrompt,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "7": {
      "inputs": {
        "text": negativePrompt,
        "clip": ["4", 1]
      },
      "class_type": "CLIPTextEncode"
    },
    "8": {
      "inputs": {
        "samples": ["3", 0],
        "vae": ["4", 2]
      },
      "class_type": "VAEDecode"
    },
    "9": {
      "inputs": {
        "filename_prefix": "ComfyUI",
        "images": ["8", 0]
      },
      "class_type": "SaveImage"
    }
  };
};

/**
 * ComfyUI에 프롬프트 전송
 */
const submitPrompt = async (workflow: any): Promise<string> => {
  try {
    const requestBody: ComfyUIPromptRequest = {
      prompt: workflow,
      client_id: `urimalzen_${Date.now()}`,
    };

    console.log('Submitting workflow to ComfyUI...');
    console.log('Workflow:', JSON.stringify(workflow, null, 2));
    
    const response = await axios.post<ComfyUIPromptResponse>(
      `${COMFYUI_API_URL}/prompt`,
      requestBody,
      {
        timeout: 10000,
      }
    );

    console.log('ComfyUI Response:', JSON.stringify(response.data, null, 2));

    // node_errors가 존재하고 비어있지 않은 경우에만 오류로 처리
    if (response.data.node_errors && Object.keys(response.data.node_errors).length > 0) {
      const errorDetails = JSON.stringify(response.data.node_errors, null, 2);
      console.error('ComfyUI Workflow Errors:', errorDetails);
      throw new Error(`ComfyUI 워크플로우 오류: ${errorDetails}`);
    }

    console.log('Workflow submitted successfully, prompt_id:', response.data.prompt_id);
    return response.data.prompt_id;
  } catch (error: any) {
    console.error('ComfyUI Submit Error:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      const errorMsg = typeof error.response.data.error === 'string' 
        ? error.response.data.error 
        : JSON.stringify(error.response.data.error);
      throw new Error(`이미지 생성 요청 실패: ${errorMsg}`);
    }
    throw new Error(`이미지 생성 요청 실패: ${error.message}`);
  }
};

/**
 * 프롬프트 상태 확인 및 이미지 정보 가져오기
 */
const waitForCompletion = async (
  promptId: string,
  maxWaitTime: number = 120000, // 2분
  checkInterval: number = 2000 // 2초
): Promise<{ filename: string; subfolder: string; type: string }> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await axios.get<ComfyUIHistoryResponse>(
        `${COMFYUI_API_URL}/history/${promptId}`
      );

      const historyItem = response.data[promptId];
      
      if (historyItem && historyItem.status.completed) {
        // outputs에서 이미지 찾기
        const outputs = historyItem.outputs;
        for (const nodeId in outputs) {
          if (outputs[nodeId].images && outputs[nodeId].images!.length > 0) {
            return outputs[nodeId].images![0];
          }
        }
        throw new Error('생성된 이미지를 찾을 수 없습니다.');
      }

      // 대기
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    } catch (error: any) {
      if (error.response?.status === 404) {
        // 아직 히스토리에 없음, 계속 대기
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        continue;
      }
      throw error;
    }
  }

  throw new Error('이미지 생성 시간 초과');
};

/**
 * ComfyUI 서버에서 이미지 다운로드
 */
const downloadImage = async (
  filename: string,
  subfolder: string = '',
  type: string = 'output'
): Promise<string> => {
  try {
    const params = new URLSearchParams({
      filename,
      subfolder,
      type,
    });

    const response = await axios.get(
      `${COMFYUI_API_URL}/view?${params.toString()}`,
      {
        responseType: 'arraybuffer',
      }
    );

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now();
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const localFilename = `${basename}_${timestamp}${ext}`;
    const localPath = path.join(COMFYUI_IMAGES_DIR, localFilename);

    // 파일 저장
    fs.writeFileSync(localPath, response.data);

    // 상대 경로 반환 (프론트엔드에서 접근할 URL)
    return `comfyui/${localFilename}`;
  } catch (error: any) {
    console.error('Image Download Error:', error.message);
    throw new Error(`이미지 다운로드 실패: ${error.message}`);
  }
};

/**
 * 단어 일러스트 생성
 */
export const generateWordIllustration = async (
  koreanWord: string,
  englishDescription?: string
): Promise<string> => {
  try {
    // 프롬프트 생성
    let positivePrompt = '';
    if (englishDescription) {
      positivePrompt = `A clear, simple illustration of ${englishDescription}, educational style, clean background, high quality, detailed`;
    } else {
      positivePrompt = `A clear, simple illustration representing the Korean word "${koreanWord}", educational style, clean background, high quality, detailed`;
    }

    const negativePrompt = 'text, watermark, signature, low quality, blurry, distorted, ugly, bad anatomy';

    // 워크플로우 생성
    const workflow = getBasicWorkflow(positivePrompt, negativePrompt, 512, 512, 25);

    // ComfyUI에 제출
    const promptId = await submitPrompt(workflow);

    // 완료 대기
    const imageInfo = await waitForCompletion(promptId);

    // 이미지 다운로드
    const localPath = await downloadImage(
      imageInfo.filename,
      imageInfo.subfolder,
      imageInfo.type
    );

    return localPath;
  } catch (error: any) {
    console.error('Word Illustration Generation Error:', error);
    throw error;
  }
};

/**
 * 테마 이미지 생성 (민들레, 배경 등)
 */
export const generateThemeImage = async (
  theme: string,
  style: 'realistic' | 'illustration' | 'minimal' = 'illustration',
  width: number = 1024,
  height: number = 1024
): Promise<string> => {
  try {
    let positivePrompt = '';
    
    switch (style) {
      case 'realistic':
        positivePrompt = `${theme}, realistic photo, high quality, 4k, professional photography`;
        break;
      case 'illustration':
        positivePrompt = `${theme}, beautiful illustration, artistic, colorful, high quality`;
        break;
      case 'minimal':
        positivePrompt = `${theme}, minimalist design, clean, simple, elegant`;
        break;
    }

    const negativePrompt = 'text, watermark, signature, low quality, blurry, distorted';

    const workflow = getBasicWorkflow(positivePrompt, negativePrompt, width, height, 30);
    const promptId = await submitPrompt(workflow);
    const imageInfo = await waitForCompletion(promptId);
    const localPath = await downloadImage(
      imageInfo.filename,
      imageInfo.subfolder,
      imageInfo.type
    );

    return localPath;
  } catch (error: any) {
    console.error('Theme Image Generation Error:', error);
    throw error;
  }
};

/**
 * 커스텀 워크플로우로 이미지 생성
 */
export const generateWithCustomWorkflow = async (
  workflow: any
): Promise<string> => {
  try {
    const promptId = await submitPrompt(workflow);
    const imageInfo = await waitForCompletion(promptId);
    const localPath = await downloadImage(
      imageInfo.filename,
      imageInfo.subfolder,
      imageInfo.type
    );

    return localPath;
  } catch (error: any) {
    console.error('Custom Workflow Generation Error:', error);
    throw error;
  }
};

/**
 * ComfyUI 서버 연결 테스트
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.get(`${COMFYUI_API_URL}/system_stats`, {
      timeout: 5000,
    });

    if (response.status === 200) {
      return {
        success: true,
        message: 'ComfyUI 연결 성공!',
      };
    }

    return {
      success: false,
      message: 'ComfyUI 서버가 응답하지 않습니다.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `ComfyUI 연결 실패: ${error.message}`,
    };
  }
};

/**
 * 대기 중인 프롬프트 개수 확인
 */
export const getQueueStatus = async (): Promise<{
  queue_running: number;
  queue_pending: number;
}> => {
  try {
    const response = await axios.get(`${COMFYUI_API_URL}/queue`);
    return {
      queue_running: response.data.queue_running?.length || 0,
      queue_pending: response.data.queue_pending?.length || 0,
    };
  } catch (error: any) {
    console.error('Queue Status Error:', error.message);
    throw new Error(`큐 상태 확인 실패: ${error.message}`);
  }
};
