import { Request, Response } from 'express';
import PhonemeRule from '../models/PhonemeRule';
import type { AuthRequest } from '../middleware/auth';

/**
 * Get all phoneme rules
 * @route GET /api/pronunciation/rules
 * @query kiipLevel - Optional KIIP level filter
 * @access Public
 */
export const getAllPhonemeRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};

    // Optional KIIP level filter
    if (req.query.kiipLevel) {
      const kiipLevel = parseInt(req.query.kiipLevel as string);
      if (!isNaN(kiipLevel) && kiipLevel >= 0 && kiipLevel <= 5) {
        query.kiipLevel = { $lte: kiipLevel };
      }
    }

    const rules = await PhonemeRule.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
    return;
  } catch (error: any) {
    console.error('Error getting phoneme rules:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get phoneme rule by ID
 * @route GET /api/pronunciation/rules/:id
 * @access Public
 */
export const getPhonemeRuleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const rule = await PhonemeRule.findById(req.params.id);

    if (!rule) {
      res.status(404).json({
        success: false,
        message: 'Phoneme rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
    return;
  } catch (error: any) {
    console.error('Error getting phoneme rule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Analyze a Korean word for pronunciation rules
 * @route POST /api/pronunciation/analyze
 * @body word - Korean word to analyze
 * @access Public
 */
export const analyzeWord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Word is required and must be a string',
      });
      return;
    }

    // Get all phoneme rules
    const allRules = await PhonemeRule.find().sort({ order: 1 });

    // Analyze which rules apply
    const applicableRules = [];

    for (const rule of allRules) {
      // Check if the rule's pattern matches the word
      // This is a simplified check - can be enhanced with more sophisticated logic
      try {
        const regex = new RegExp(rule.pattern);
        if (regex.test(word)) {
          applicableRules.push({
            ruleId: rule._id,
            ruleName: rule.ruleName,
            ruleNameMn: rule.ruleNameMn,
            description: rule.description,
            descriptionMn: rule.descriptionMn,
            examples: rule.examples,
          });
        }
      } catch (regexError) {
        // Skip if pattern is not a valid regex
        console.warn(`Invalid regex pattern for rule ${rule.ruleName}: ${rule.pattern}`);
        continue;
      }
    }

    res.status(200).json({
      success: true,
      word,
      rulesFound: applicableRules.length,
      rules: applicableRules,
    });
    return;
  } catch (error: any) {
    console.error('Error analyzing word:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Get phoneme rule by name
 * @route GET /api/pronunciation/rules/name/:ruleName
 * @access Public
 */
export const getPhonemeRuleByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const rule = await PhonemeRule.findOne({ ruleName: req.params.ruleName });

    if (!rule) {
      res.status(404).json({
        success: false,
        message: 'Phoneme rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
    return;
  } catch (error: any) {
    console.error('Error getting phoneme rule by name:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Create new phoneme rule (Admin only)
 * @route POST /api/pronunciation/rules
 * @access Private/Admin
 */
export const createPhonemeRule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      ruleName,
      ruleNameEn,
      ruleNameMn,
      description,
      descriptionMn,
      pattern,
      examples,
      kiipLevel,
      order,
    } = req.body;

    // Check if rule already exists
    const existingRule = await PhonemeRule.findOne({ ruleName });
    if (existingRule) {
      res.status(400).json({
        success: false,
        message: 'Phoneme rule with this name already exists',
      });
      return;
    }

    const rule = await PhonemeRule.create({
      ruleName,
      ruleNameEn,
      ruleNameMn,
      description,
      descriptionMn,
      pattern,
      examples: examples || [],
      kiipLevel,
      order,
    });

    res.status(201).json({
      success: true,
      data: rule,
    });
    return;
  } catch (error: any) {
    console.error('Error creating phoneme rule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Update phoneme rule (Admin only)
 * @route PUT /api/pronunciation/rules/:id
 * @access Private/Admin
 */
export const updatePhonemeRule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rule = await PhonemeRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!rule) {
      res.status(404).json({
        success: false,
        message: 'Phoneme rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
    return;
  } catch (error: any) {
    console.error('Error updating phoneme rule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};

/**
 * Delete phoneme rule (Admin only)
 * @route DELETE /api/pronunciation/rules/:id
 * @access Private/Admin
 */
export const deletePhonemeRule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rule = await PhonemeRule.findById(req.params.id);

    if (!rule) {
      res.status(404).json({
        success: false,
        message: 'Phoneme rule not found',
      });
      return;
    }

    await rule.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Phoneme rule deleted successfully',
    });
    return;
  } catch (error: any) {
    console.error('Error deleting phoneme rule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
    return;
  }
};
