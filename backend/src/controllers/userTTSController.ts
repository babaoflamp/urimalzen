import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as ttsService from '../services/ttsService';
import AudioContent from '../models/AudioContent';
import Word from '../models/Word';

/**
 * Get TTS audio for a word (returns existing or generates new)
 * GET /api/tts/word/:wordId
 */
export const getWordAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.params;

    // Check if audio already exists
    let audio = await AudioContent.findOne({ wordId, audioType: 'word' }).sort({ createdAt: -1 });

    // If no audio exists, generate it
    if (!audio) {
      const word = await Word.findById(wordId);
      if (!word) {
        res.status(404).json({ success: false, message: 'Word not found' });
        return;
      }

      const audioData = await ttsService.generateWordAudio(word.koreanWord, wordId);
      audio = audioData as any;
    }

    res.status(200).json({
      success: true,
      data: audio,
    });
    return;
  } catch (error: any) {
    console.error('Error getting word audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get word audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Real-time TTS generation (on-the-fly, not saved)
 * POST /api/tts/generate
 */
export const generateRealTimeTTS = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, voice, speed, pitch } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Text is required' });
      return;
    }

    const audioData = await ttsService.generateRealTimeTTS(text, { voice, speed, pitch });

    res.status(200).json({
      success: true,
      data: audioData,
      message: 'Audio generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating real-time TTS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Get audio for word example
 * GET /api/tts/example/:wordId/:exampleIndex
 */
export const getExampleAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId, exampleIndex } = req.params;
    const index = parseInt(exampleIndex);

    // Check if audio already exists
    let audio = await AudioContent.findOne({
      wordId,
      audioType: 'example',
      // We'd need a field to track example index - for now just get latest
    }).sort({ createdAt: -1 });

    // If no audio exists, generate it
    if (!audio) {
      const word = await Word.findById(wordId);
      if (!word || !word.examples[index]) {
        res.status(404).json({ success: false, message: 'Word or example not found' });
        return;
      }

      const exampleText = word.examples[index].korean;
      const audioData = await ttsService.generateExampleAudio(exampleText, wordId);
      audio = audioData as any;
    }

    res.status(200).json({
      success: true,
      data: audio,
    });
    return;
  } catch (error: any) {
    console.error('Error getting example audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get example audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Get all available audio for a word (word + examples)
 * GET /api/tts/word-all/:wordId
 */
export const getAllWordAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.params;

    const audioFiles = await AudioContent.find({ wordId }).sort({ audioType: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: audioFiles,
      count: audioFiles.length,
    });
    return;
  } catch (error: any) {
    console.error('Error getting all word audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get word audio',
      error: error.message,
    });
    return;
  }
};
