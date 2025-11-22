import { Request, Response } from 'express';
import * as comfyuiService from '../services/comfyuiService';

/**
 * ComfyUI 연결 테스트
 */
export const testConnection = async (req: Request, res: Response) => {
  try {
    const result = await comfyuiService.testConnection();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 큐 상태 확인
 */
export const getQueueStatus = async (req: Request, res: Response) => {
  try {
    const status = await comfyuiService.getQueueStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 단어 일러스트 생성
 */
export const generateWordIllustration = async (req: Request, res: Response) => {
  try {
    const { koreanWord, englishDescription } = req.body;

    if (!koreanWord) {
      return res.status(400).json({
        success: false,
        message: '한국어 단어를 입력해주세요.',
      });
    }

    const imagePath = await comfyuiService.generateWordIllustration(
      koreanWord,
      englishDescription
    );

    res.json({
      success: true,
      imagePath,
      message: '이미지가 성공적으로 생성되었습니다.',
    });
  } catch (error: any) {
    console.error('Word Illustration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 테마 이미지 생성
 */
export const generateThemeImage = async (req: Request, res: Response) => {
  try {
    const { 
      theme, 
      style = 'illustration', 
      width = 1024, 
      height = 1024 
    } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: '테마를 입력해주세요.',
      });
    }

    const imagePath = await comfyuiService.generateThemeImage(
      theme,
      style,
      width,
      height
    );

    res.json({
      success: true,
      imagePath,
      message: '테마 이미지가 성공적으로 생성되었습니다.',
    });
  } catch (error: any) {
    console.error('Theme Image Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 커스텀 워크플로우로 이미지 생성
 */
export const generateCustomImage = async (req: Request, res: Response) => {
  try {
    const { workflow } = req.body;

    if (!workflow) {
      return res.status(400).json({
        success: false,
        message: '워크플로우를 입력해주세요.',
      });
    }

    const imagePath = await comfyuiService.generateWithCustomWorkflow(workflow);

    res.json({
      success: true,
      imagePath,
      message: '이미지가 성공적으로 생성되었습니다.',
    });
  } catch (error: any) {
    console.error('Custom Image Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
