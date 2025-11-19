import { Request, Response } from 'express';
import Word from '../models/Word';
import { AuthRequest } from '../middleware/auth';

export const getAllWords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const words = await Word.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: words.length,
      data: words,
    });
  } catch (error: any) {
    console.error('Get all words error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const word = await Word.findById(id);

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Get word by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWordByOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { order } = req.params;

    const word = await Word.findOne({ order: parseInt(order) });

    if (!word) {
      res.status(404).json({ message: 'Word not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Get word by order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createWord = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const wordData = req.body;

    const word = await Word.create(wordData);

    res.status(201).json({
      success: true,
      data: word,
    });
  } catch (error: any) {
    console.error('Create word error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
