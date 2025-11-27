import { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import PronunciationTestSession from '../models/PronunciationTestSession';
import PronunciationTestAnswer from '../models/PronunciationTestAnswer';
import ExcelJS from 'exceljs';

/**
 * Export test session results to Excel
 * @route GET /api/pronunciation/test/session/:id/export
 * @access Private
 */
export const exportSessionToExcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.id;

    // Verify session belongs to user
    const session = await PronunciationTestSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    }).populate('selectedSentenceIds');

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Test session not found',
      });
      return;
    }

    // Get all answers for this session
    const answers = await PronunciationTestAnswer.find({ sessionId })
      .populate('sentenceId')
      .sort({ sentenceNumber: 1 });

    if (answers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No answers found for this session',
      });
      return;
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('발음 평가 결과');

    // Set column widths
    worksheet.columns = [
      { header: '이름', key: 'userName', width: 15 },
      { header: '문장 번호', key: 'sentenceNumber', width: 12 },
      { header: '문장 (한국어)', key: 'koreanText', width: 40 },
      { header: '문장 (몽골어)', key: 'mongolianText', width: 40 },
      { header: '문장 점수', key: 'sentenceScore', width: 12 },
      { header: '단어', key: 'word', width: 15 },
      { header: '단어 점수', key: 'wordScore', width: 12 },
      { header: '음소 점수', key: 'phonemeScores', width: 25 },
      { header: '소요 시간(초)', key: 'timeSpent', width: 15 },
      { header: '평가 일시', key: 'evaluatedAt', width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    for (const answer of answers) {
      const sentenceScore = answer.evaluationResult.sentenceScore;
      const wordScores = answer.evaluationResult.wordScores || [];

      if (wordScores.length === 0) {
        // If no word scores, add sentence-level row only
        worksheet.addRow({
          userName: session.userName,
          sentenceNumber: answer.sentenceNumber,
          koreanText: answer.koreanText,
          mongolianText: answer.mongolianText,
          sentenceScore: (sentenceScore * 100).toFixed(1) + '%',
          word: '-',
          wordScore: '-',
          phonemeScores: '-',
          timeSpent: answer.timeSpent,
          evaluatedAt: answer.evaluatedAt.toLocaleString('ko-KR'),
        });
      } else {
        // Add one row per word
        wordScores.forEach((wordScore, index) => {
          const phonemeScoresStr = wordScore.phonemeScores
            ? wordScore.phonemeScores.map((s) => (s * 100).toFixed(1) + '%').join(', ')
            : '-';

          worksheet.addRow({
            userName: index === 0 ? session.userName : '',
            sentenceNumber: index === 0 ? answer.sentenceNumber : '',
            koreanText: index === 0 ? answer.koreanText : '',
            mongolianText: index === 0 ? answer.mongolianText : '',
            sentenceScore: index === 0 ? (sentenceScore * 100).toFixed(1) + '%' : '',
            word: wordScore.word,
            wordScore: (wordScore.score * 100).toFixed(1) + '%',
            phonemeScores: phonemeScoresStr,
            timeSpent: index === 0 ? answer.timeSpent : '',
            evaluatedAt: index === 0 ? answer.evaluatedAt.toLocaleString('ko-KR') : '',
          });
        });
      }

      // Add empty row between sentences for readability
      worksheet.addRow({});
    }

    // Add summary section
    worksheet.addRow({});
    worksheet.addRow({});
    const summaryStartRow = worksheet.lastRow!.number + 1;

    worksheet.addRow({
      userName: '=== 요약 ===',
    });
    worksheet.addRow({
      userName: '총 문장 수:',
      sentenceNumber: session.totalSentences,
    });
    worksheet.addRow({
      userName: '완료한 문장 수:',
      sentenceNumber: session.completedSentences,
    });
    worksheet.addRow({
      userName: '평균 점수:',
      sentenceNumber: (session.averageScore * 100).toFixed(1) + '%',
    });
    worksheet.addRow({
      userName: '총 소요 시간:',
      sentenceNumber: session.totalDuration + '초',
    });
    worksheet.addRow({
      userName: '테스트 시작:',
      sentenceNumber: session.startTime.toLocaleString('ko-KR'),
    });
    if (session.endTime) {
      worksheet.addRow({
        userName: '테스트 종료:',
        sentenceNumber: session.endTime.toLocaleString('ko-KR'),
      });
    }

    // Style summary section
    for (let i = summaryStartRow; i <= worksheet.lastRow!.number; i++) {
      const row = worksheet.getRow(i);
      row.font = { bold: true };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' },
      };
    }

    // Set response headers for file download
    const fileName = `pronunciation_test_${session.userName}_${Date.now()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    return;
  } catch (error: any) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export to Excel',
      error: error.message,
    });
    return;
  }
};
