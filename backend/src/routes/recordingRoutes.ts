import express from 'express';
import {
  uploadRecording,
  getRecordingsByWord,
  getAllRecordings,
} from '../controllers/recordingController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/', authenticate, upload.single('audio'), uploadRecording);
router.get('/', authenticate, getAllRecordings);
router.get('/word/:wordId', authenticate, getRecordingsByWord);

export default router;
