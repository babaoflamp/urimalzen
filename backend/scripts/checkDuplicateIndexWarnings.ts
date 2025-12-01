import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';

async function run() {
  console.log('Connecting to MongoDB to trigger model index registration...');
  await mongoose.connect(MONGODB_URI, {});

  // Import models to trigger index/validation registration
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../src/models/PronunciationTestSentence');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../src/models/Word');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../src/models/UserProgress');

  console.log('Models loaded — disconnecting. If duplicate-index warnings appeared above, they will have been printed.');
  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error during check:', err);
    process.exit(2);
  });
