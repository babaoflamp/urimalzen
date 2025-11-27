import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as ttsService from '../services/ttsService';
import AudioContent from '../models/AudioContent';
import Word from '../models/Word';
import PhonemeRule from '../models/PhonemeRule';

/**
 * Generate TTS audio for a word
 * POST /api/admin/tts/generate-word-audio
 */
export const generateWordAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId, speaker, tempo, pitch, gain } = req.body;

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

    // Map speaker string to MzTTS model/speaker numbers
    const speakerMapping: Record<string, { model: number; speaker: number }> = {
      'Jieun-neutral': { model: 0, speaker: 0 },
      'Jieun-pleasure': { model: 0, speaker: 1 },
      'Jieun-anger': { model: 0, speaker: 2 },
      'Jieun-sadness': { model: 0, speaker: 3 },
      'Seojun-neutral': { model: 0, speaker: 4 },
      'Seojun-pleasure': { model: 0, speaker: 5 },
      'Seojun-anger': { model: 0, speaker: 6 },
      'Seojun-sadness': { model: 0, speaker: 7 },
    };

    const speakerConfig = speakerMapping[speaker] || { model: 0, speaker: 4 }; // Default to Seojun-neutral

    // Generate audio using MzTTS
    const audioData = await ttsService.generateWordAudio(word.koreanWord, wordId, {
      model: speakerConfig.model,
      speaker: speakerConfig.speaker,
      tempo: tempo !== undefined ? tempo : 1.0,
      pitch: pitch !== undefined ? pitch : 1.0,
      gain: gain !== undefined ? gain : 1.0,
    });

    res.status(200).json({
      success: true,
      data: audioData,
      message: 'Word audio generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating word audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate word audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate TTS audio for word examples
 * POST /api/admin/tts/generate-example-audio
 */
export const generateExampleAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId, exampleIndex, voice, speed, pitch } = req.body;

    if (!wordId || exampleIndex === undefined) {
      res.status(400).json({ success: false, message: 'Word ID and example index are required' });
      return;
    }

    // Find word
    const word = await Word.findById(wordId);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }

    if (!word.examples[exampleIndex]) {
      res.status(404).json({ success: false, message: 'Example not found' });
      return;
    }

    // Generate audio for example
    const exampleText = word.examples[exampleIndex].korean;
    const audioData = await ttsService.generateExampleAudio(exampleText, wordId, {
      voice,
      speed,
      pitch,
    });

    res.status(200).json({
      success: true,
      data: audioData,
      message: 'Example audio generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating example audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate example audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Generate TTS audio for phoneme rule examples
 * POST /api/admin/tts/generate-phoneme-audio
 */
export const generatePhonemeAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ruleId, exampleIndex, voice, speed, pitch } = req.body;

    if (!ruleId || exampleIndex === undefined) {
      res.status(400).json({ success: false, message: 'Rule ID and example index are required' });
      return;
    }

    // Find phoneme rule
    const rule = await PhonemeRule.findById(ruleId);
    if (!rule) {
      res.status(404).json({ success: false, message: 'Phoneme rule not found' });
      return;
    }

    if (!rule.examples[exampleIndex]) {
      res.status(404).json({ success: false, message: 'Example not found' });
      return;
    }

    // Generate audio for phoneme rule example
    const exampleWord = rule.examples[exampleIndex].word;
    const audioData = await ttsService.generatePhonemeRuleAudio(exampleWord, {
      voice,
      speed,
      pitch,
    });

    res.status(200).json({
      success: true,
      data: audioData,
      message: 'Phoneme rule audio generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error generating phoneme audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate phoneme audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Batch generate TTS audio for multiple words
 * POST /api/admin/tts/batch-generate
 */
export const batchGenerateAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordIds, audioType = 'word', voice, speed, pitch } = req.body;

    if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0) {
      res.status(400).json({ success: false, message: 'Word IDs array is required' });
      return;
    }

    // Fetch words and prepare texts array
    const words = await Word.find({ _id: { $in: wordIds } });
    const texts = words.map(word => ({
      text: word.koreanWord,
      id: word._id.toString(),
    }));

    const results = await ttsService.generateBatchAudio(texts, {
      voice,
      speed,
      pitch,
    });

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      data: results,
      message: `Batch audio generation completed. Success: ${successCount}, Errors: ${errorCount}`,
    });
    return;
  } catch (error: any) {
    console.error('Error in batch audio generation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch generate audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Get all audio content for a word
 * GET /api/admin/tts/word-audio/:wordId
 */
export const getWordAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { wordId } = req.params;

    const audioFiles = await AudioContent.find({ wordId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: audioFiles,
      count: audioFiles.length,
    });
    return;
  } catch (error: any) {
    console.error('Error fetching word audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch word audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete audio file
 * DELETE /api/admin/tts/audio/:audioId
 */
export const deleteAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { audioId } = req.params;

    const audio = await AudioContent.findById(audioId);
    if (!audio) {
      res.status(404).json({ success: false, message: 'Audio not found' });
      return;
    }

    // Delete file from filesystem
    await ttsService.deleteAudioFile(audio.fileUrl);

    // Delete from database
    await AudioContent.findByIdAndDelete(audioId);

    res.status(200).json({
      success: true,
      message: 'Audio deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete audio',
      error: error.message,
    });
    return;
  }
};

/**
 * Get all audio content (paginated)
 * GET /api/admin/tts/audio?page=1&limit=20&audioType=word
 */
export const getAllAudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const audioType = req.query.audioType as string;

    const filter: any = {};
    if (audioType) {
      filter.audioType = audioType;
    }

    const skip = (page - 1) * limit;

    const [audioFiles, total] = await Promise.all([
      AudioContent.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('wordId', 'koreanWord mongolianWord'),
      AudioContent.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: audioFiles,
      count: audioFiles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error: any) {
    console.error('Error fetching all audio:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audio files',
      error: error.message,
    });
    return;
  }
};

/**
 * Test TTS service connection
 * GET /api/admin/tts/test-connection
 */
export const testTTSConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Debug: Check environment variables
    console.log('Environment variables check:');
    console.log('MZTTS_API_URL:', process.env.MZTTS_API_URL);
    console.log('TTS_API_URL:', process.env.TTS_API_URL);

    const result = await ttsService.testConnection();

    res.status(200).json({
      success: true,
      data: result,
      debug: {
        MZTTS_API_URL: process.env.MZTTS_API_URL || 'NOT SET',
        TTS_API_URL: process.env.TTS_API_URL || 'NOT SET',
      },
      message: 'TTS service connection test completed',
    });
    return;
  } catch (error: any) {
    console.error('Error testing TTS connection:', error);
    res.status(500).json({
      success: false,
      message: 'TTS service connection test failed',
      error: error.message,
      debug: {
        MZTTS_API_URL: process.env.MZTTS_API_URL || 'NOT SET',
        TTS_API_URL: process.env.TTS_API_URL || 'NOT SET',
      },
    });
    return;
  }
};

/**
 * Test TTS with custom text and settings
 * POST /api/admin/tts/test
 */
export const testTTS = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, speaker, tempo, pitch, gain } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Text is required for TTS test' });
      return;
    }

    // Map speaker string to MzTTS model/speaker numbers
    const speakerMapping: Record<string, { model: number; speaker: number }> = {
      'Jieun-neutral': { model: 0, speaker: 0 },
      'Jieun-pleasure': { model: 0, speaker: 1 },
      'Jieun-anger': { model: 0, speaker: 2 },
      'Jieun-sadness': { model: 0, speaker: 3 },
      'Seojun-neutral': { model: 0, speaker: 4 },
      'Seojun-pleasure': { model: 0, speaker: 5 },
      'Seojun-anger': { model: 0, speaker: 6 },
      'Seojun-sadness': { model: 0, speaker: 7 },
    };

    const speakerConfig = speakerMapping[speaker] || { model: 0, speaker: 4 }; // Default to Seojun-neutral

    // Generate test audio using MzTTS
    const audioData = await ttsService.generateWordAudio(text, 'test', {
      model: speakerConfig.model,
      speaker: speakerConfig.speaker,
      tempo: tempo !== undefined ? tempo : 1.0,
      pitch: pitch !== undefined ? pitch : 1.0,
      gain: gain !== undefined ? gain : 1.0,
    });

    res.json({
      success: true,
      data: {
        text,
        speaker,
        settings: { tempo, pitch, gain },
        audioUrl: audioData.audioUrl,
      },
      message: 'Test TTS audio generated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error testing TTS:', error);
    res.status(500).json({
      success: false,
      message: 'TTS test failed',
      error: error.message,
    });
    return;
  }
};
