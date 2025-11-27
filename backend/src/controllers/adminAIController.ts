import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/aiService';
import Word from '../models/Word';
import Unit from '../models/Unit';

/**
 * Generate AI description for a word
 * POST /api/admin/ai/generate-description
 */
export const generateWordDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId, language } = req.body;

    if (!wordId) {
      res.status(400).json({ success: false, message: 'Word ID is required' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Generate description
    const result = await aiService.generateWordDescription(word.koreanWord, language as 'ko' | 'mn' | 'both');

    // Update word with AI-generated description
    if (result.ko) {
      word.description = result.ko;
    }
    await word.save();

    res.status(200).json({
      success: true,
      data: result,
      message: 'Word description generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating word description:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate word description',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate AI examples for a word
 * POST /api/admin/ai/generate-examples
 */
export const generateWordExamples = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId, count = 3 } = req.body;

    if (!wordId) {
      res.status(400).json({ success: false, message: 'Word ID is required' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Generate examples
    const examples = await aiService.generateExamples(word.koreanWord, count);

    // Update word with AI-generated examples
    word.examples = examples;
    await word.save();

    res.status(200).json({
      success: true,
      data: { examples },
      message: 'Word examples generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating word examples:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate word examples',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate AI pronunciation tips for a word
 * POST /api/admin/ai/generate-pronunciation-tips
 */
export const generatePronunciationTips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.body;

    if (!wordId) {
      res.status(400).json({ success: false, message: 'Word ID is required' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Generate pronunciation tips
    const tips = await aiService.generatePronunciationTips(word.koreanWord);

    res.status(200).json({
      success: true,
      data: { tips },
      message: 'Pronunciation tips generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating pronunciation tips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate pronunciation tips',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate full AI content for a word (description + examples + tips)
 * POST /api/admin/ai/generate-full-content
 */
export const generateFullContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.body;

    if (!wordId) {
      res.status(400).json({ success: false, message: 'Word ID is required' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    // Generate full content
    const content = await aiService.generateFullContent(word.koreanWord);

    // Update word with all AI-generated content
    if (content.description?.ko) {
      word.description = content.description.ko;
    }
    if (content.examples) {
      word.examples = content.examples;
    }
    await word.save();

    res.status(200).json({
      success: true,
      data: content,
      message: 'Full content generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating full content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate full content',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate AI lesson content for a unit
 * POST /api/admin/ai/generate-lesson-content
 */
export const generateLessonContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { unitId, lessonNumber } = req.body;

    if (!unitId || lessonNumber === undefined) {
      res.status(400).json({ success: false, message: 'Unit ID and lesson number are required' });
      return;
    }

    // Find unit
    const unit = await Unit.findById(unitId).populate('lessons.wordIds');
    if (!unit) {
      res.status(404).json({ success: false, message: 'Unit not found' });
      return;
    }

    // Find specific lesson
    const lesson = unit.lessons.find((l) => l.lessonNumber === lessonNumber);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found' });
      return;
    }

    // Get word list for lesson
    const words = lesson.wordIds as any[];
    const wordList = words.map((w) => w.koreanWord);

    // Generate lesson content
    const content = await aiService.generateLessonContent(lesson.title, wordList);

    res.status(200).json({
      success: true,
      data: content,
      message: 'Lesson content generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating lesson content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lesson content',
      error: error.message,
    });
    return;
  }
};

/**
 * Batch generate AI content for multiple words
 * POST /api/admin/ai/batch-generate
 */
export const batchGenerateContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordIds, contentType = 'full' } = req.body;

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      res.status(400).json({ success: false, message: 'Word IDs array is required' });
      return;
    }

    const results = [];
    const errors = [];

    for (const wordId of wordIds) {
      try {
        const word = await Word.findById(wordId);
        if (!word) {
          errors.push({ wordId, error: 'Word not found' });
          continue;
        }

        if (contentType === 'full') {
          const content = await aiService.generateFullContent(word.koreanWord);
          if (content.description?.ko) {
            word.description = content.description.ko;
          }
          if (content.examples) {
            word.examples = content.examples;
          }
          await word.save();
          results.push({ wordId, success: true, data: content });
        } else if (contentType === 'description') {
          const description = await aiService.generateWordDescription(word.koreanWord);
          if (description.ko) {
            word.description = description.ko;
          }
          await word.save();
          results.push({ wordId, success: true, data: { description } });
        } else if (contentType === 'examples') {
          const examples = await aiService.generateExamples(word.koreanWord, 3);
          word.examples = examples;
          await word.save();
          results.push({ wordId, success: true, data: { examples } });
        }
      } catch (error: any) {
        errors.push({ wordId, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      data: { results, errors },
      message: `Batch generation completed. Success: ${results.length}, Errors: ${errors.length}`,
    });
    return;
  } catch (error: any) {
    console.error('Error in batch generation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch generate content',
      error: error.message,
    });
    return;
  }
};

/**
 * Test AI service connection
 * GET /api/admin/ai/test-connection
 */
export const testAIConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await aiService.testConnection();

    res.status(200).json({
      success: true,
      data: result,
      message: 'AI service connection test completed',
    });
    return;
  } catch (error: any) {
    console.error('Error testing AI connection:', error);
    res.status(500).json({
      success: false,
      message: 'AI service connection test failed',
      error: error.message,
    });
    return;
  }
};
