import 'dotenv/config';
import mongoose from 'mongoose';
import PronunciationTestSentence from '../src/models/PronunciationTestSentence';
import * as speechproService from '../src/services/speechproService';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
const PAUSE_MS = Number(process.env.MIGRATE_PAUSE_MS || '500');
const LIMIT = Number(process.env.MIGRATE_LIMIT || '0'); // 0 = no limit

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function migrate() {
  console.log('Connecting to MongoDB...', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { });
  console.log('Connected. Searching for sentences missing SpeechPro model (fst)...');

  const query = {
    $or: [
      { 'speechPro.fst': { $exists: false } },
      { 'speechPro.fst': '' },
      { speechPro: { $exists: false } },
    ],
  };

  const cursor = PronunciationTestSentence.find(query).cursor();
  let processed = 0;
  let success = 0;
  let failed = 0;

  for await (const doc of cursor) {
    if (LIMIT && processed >= LIMIT) break;
    processed += 1;
    const id = doc._id.toString();
    // Use toObject to expose any non-schema fields and virtuals
    const obj = (doc as any).toObject ? (doc as any).toObject({ getters: true, virtuals: true }) : (doc as any);
    const text = obj.koreanText ?? obj.sentence ?? obj.korean_text ?? obj.korean ?? '';
    console.log(`${processed}. Processing id=${id} order=${doc.order} text="${text.slice(0,60)}"`);

    try {
      // Step 1: call GTP
      const gtp = await speechproService.callGTP({ id, text });
      if (gtp['error code'] && gtp['error code'] !== 0) {
        console.warn('GTP returned error code', gtp['error code']);
        await PronunciationTestSentence.updateOne({ _id: id }, { $set: { 'speechPro.errorCode': gtp['error code'] } });
        failed += 1;
        await sleep(PAUSE_MS);
        continue;
      }

      const syllLtrs = gtp['syll ltrs'] ?? '';
      const syllPhns = gtp['syll phns'] ?? '';

      // Step 2: call Model
      const model = await speechproService.callModel({ id, text, 'syll ltrs': syllLtrs, 'syll phns': syllPhns });
      if (model['error code'] && model['error code'] !== 0) {
        console.warn('Model returned error code', model['error code']);
        await PronunciationTestSentence.updateOne({ _id: id }, { $set: { 'speechPro.errorCode': model['error code'] } });
        failed += 1;
        await sleep(PAUSE_MS);
        continue;
      }

      // Update document
      const update = {
        'speechPro.syllLtrs': model['syll ltrs'] ?? syllLtrs,
        'speechPro.syllPhns': model['syll phns'] ?? syllPhns,
        'speechPro.fst': model.fst ?? '',
        'speechPro.lastUpdated': new Date(),
        'speechPro.errorCode': 0,
      } as any;

      await PronunciationTestSentence.updateOne({ _id: id }, { $set: update });
      console.log('  -> Updated speechPro for id=', id);
      success += 1;
    } catch (err: any) {
      console.error('  -> Error processing id=', id, err && err.message ? err.message : err);
      failed += 1;
    }

    await sleep(PAUSE_MS);
  }

  console.log('Migration completed. processed=', processed, 'success=', success, 'failed=', failed);
  await mongoose.disconnect();
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(2);
  });
