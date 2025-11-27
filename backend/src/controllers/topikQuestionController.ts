import { Request, Response } from 'express';
import TOPIKQuestion from '../models/TOPIKQuestion';

// Get all TOPIK questions with optional filters
export const getAllQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topikLevel, testSection } = req.query;

    const filter: any = {};
    if (topikLevel) filter.topikLevel = parseInt(topikLevel as string);
    if (testSection) filter.testSection = testSection;

    const questions = await TOPIKQuestion.find(filter)
      .populate('relatedWordIds', 'koreanWord mongolianWord')
      .sort({ questionNumber: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
    return;
  } catch (error: any) {
    console.error('Get all questions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get questions by level
export const getQuestionsByLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { topikLevel } = req.params;

    const questions = await TOPIKQuestion.find({ topikLevel: parseInt(topikLevel) })
      .populate('relatedWordIds', 'koreanWord mongolianWord')
      .sort({ questionNumber: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
    return;
  } catch (error: any) {
    console.error('Get questions by level error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get questions by section
export const getQuestionsBySection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { testSection } = req.params;
    const { topikLevel } = req.query;

    const filter: any = { testSection };
    if (topikLevel) filter.topikLevel = parseInt(topikLevel as string);

    const questions = await TOPIKQuestion.find(filter)
      .populate('relatedWordIds', 'koreanWord mongolianWord')
      .sort({ questionNumber: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
    return;
  } catch (error: any) {
    console.error('Get questions by section error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Get single question by ID
export const getQuestionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await TOPIKQuestion.findById(id)
      .populate('relatedWordIds', 'koreanWord mongolianWord');

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: question,
    });
    return;
  } catch (error: any) {
    console.error('Get question by id error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Create new question (Admin only)
export const createQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questionData = req.body;

    const question = await TOPIKQuestion.create(questionData);

    res.status(201).json({
      success: true,
      data: question,
      message: 'Question created successfully',
    });
    return;
  } catch (error: any) {
    console.error('Create question error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Update question (Admin only)
export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await TOPIKQuestion.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: question,
      message: 'Question updated successfully',
    });
    return;
  } catch (error: any) {
    console.error('Update question error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Delete question (Admin only)
export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await TOPIKQuestion.findByIdAndDelete(id);

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Delete question error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};

// Record user answer attempt (updates attemptCount and correctCount)
export const recordAttempt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;

    const question = await TOPIKQuestion.findById(id);

    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    // Update attempt statistics
    question.attemptCount += 1;
    if (isCorrect) {
      question.correctCount += 1;
    }
    question.averageScore = (question.correctCount / question.attemptCount) * 100;

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
      message: 'Attempt recorded successfully',
    });
    return;
  } catch (error: any) {
    console.error('Record attempt error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
    return;
  }
};
