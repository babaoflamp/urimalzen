import { Response } from 'express';
import Recording from '../models/Recording';
import UserProgress from '../models/UserProgress';
import { AuthRequest } from '../middleware/auth';
import path from 'path';

export const uploadRecording = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { wordId, duration } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!wordId) {
      res.status(400).json({ message: 'Word ID is required' });
      return;
    }

    const userId = req.user._id;

    // Create recording entry
    const recording = await Recording.create({
      userId,
      wordId,
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.filename,
      fileSize: file.size,
      duration: duration || 0,
      mimeType: file.mimetype,
    });

    // Update user progress
    let progress = await UserProgress.findOne({ userId, wordId });

    if (!progress) {
      progress = await UserProgress.create({
        userId,
        wordId,
        attempts: 1,
        recordings: [recording._id],
      });
    } else {
      progress.attempts += 1;
      progress.recordings.push(recording._id);
      progress.lastAttemptAt = new Date();
      await progress.save();
    }

    res.status(201).json({
      success: true,
      data: recording,
      progress: {
        attempts: progress.attempts,
        completed: progress.completed,
        score: progress.score,
      },
    });
  } catch (error: any) {
    console.error('Upload recording error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecordingsByWord = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const recordings = await Recording.find({ userId, wordId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: recordings.length,
      data: recordings,
    });
  } catch (error: any) {
    console.error('Get recordings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllRecordings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;

    const recordings = await Recording.find({ userId })
      .populate('wordId', 'koreanWord mongolianWord')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recordings.length,
      data: recordings,
    });
  } catch (error: any) {
    console.error('Get all recordings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
