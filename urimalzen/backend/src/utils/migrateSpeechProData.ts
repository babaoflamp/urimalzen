import { Client } from 'pg';
import mongoose from 'mongoose';
import PronunciationTestSentence from '../models/PronunciationTestSentence';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL configuration (korean-pro-demo)
const pgConfig = {
  host: '112.220.79.218',
  port: 18154,
  database: 'mkaieconcamp',
  user: 'mkaieconcamp',
  password: 'mkaieconcamp',
};

// MongoDB URI from environment
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';

interface PostgresQuestion {
  ko_id: number;
  order: number;
  sentence: string;
  syll_ltrs: string;
  syll_phns: string;
  fst: string;
}

async function migrateSpeechProData() {
  const pgClient = new Client(pgConfig);

  try {
    console.log('= Connecting to PostgreSQL...');
    await pgClient.connect();
    console.log(' PostgreSQL connected');

    console.log('= Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log(' MongoDB connected');

    // Query all 20 sentences from PostgreSQL
    console.log('\n=Ê Fetching pronunciation test sentences from PostgreSQL...');
    const result = await pgClient.query<PostgresQuestion>(`
      SELECT ko_id, "order", sentence, syll_ltrs, syll_phns, fst
      FROM sp_ko_question
      ORDER BY "order"
    `);

    const questions = result.rows;
    console.log(`Found ${questions.length} sentences to migrate`);

    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Migrate each sentence to MongoDB
    for (const question of questions) {
      try {
        // Check if sentence already exists (by order)
        const existing = await PronunciationTestSentence.findOne({ order: question.order });

        if (existing) {
          // Update existing sentence
          existing.sentence = question.sentence;
          existing.speechPro = {
            syllLtrs: question.syll_ltrs,
            syllPhns: question.syll_phns,
            fst: question.fst,
            lastUpdated: new Date(),
            errorCode: 0,
          };
          await existing.save();
          updatedCount++;
          console.log(`  Updated sentence #${question.order}: "${question.sentence.substring(0, 30)}..."`);
        } else {
          // Insert new sentence
          const newSentence = new PronunciationTestSentence({
            sentence: question.sentence,
            order: question.order,
            speechPro: {
              syllLtrs: question.syll_ltrs,
              syllPhns: question.syll_phns,
              fst: question.fst,
              lastUpdated: new Date(),
              errorCode: 0,
            },
            // Default values for optional fields
            level: {
              kiip: determineKiipLevel(question.order), // Simple heuristic
              cefr: determineCefrLevel(question.order),
            },
            difficultyScore: calculateDifficulty(question.sentence),
          });

          await newSentence.save();
          insertedCount++;
          console.log(`( Inserted sentence #${question.order}: "${question.sentence.substring(0, 30)}..."`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`L Error processing sentence #${question.order}:`, error.message);
      }
    }

    // Summary
    console.log('\n=È Migration Summary:');
    console.log(`   ( Inserted: ${insertedCount}`);
    console.log(`     Updated: ${updatedCount}`);
    console.log(`   L Errors: ${errorCount}`);
    console.log(`   =Ê Total processed: ${questions.length}`);

  } catch (error) {
    console.error('L Migration failed:', error);
    throw error;
  } finally {
    // Cleanup connections
    await pgClient.end();
    await mongoose.disconnect();
    console.log('\n Migration completed. Connections closed.');
  }
}

// Helper function to determine KIIP level based on order (simple heuristic)
function determineKiipLevel(order: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (order <= 4) return 0;      // Very basic sentences
  if (order <= 8) return 1;      // Basic sentences
  if (order <= 12) return 2;     // Intermediate sentences
  if (order <= 16) return 3;     // Advanced sentences
  if (order <= 18) return 4;     // High advanced
  return 5;                      // Expert level
}

// Helper function to determine CEFR level
function determineCefrLevel(order: number): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' {
  if (order <= 4) return 'A1';
  if (order <= 8) return 'A2';
  if (order <= 12) return 'B1';
  if (order <= 16) return 'B2';
  if (order <= 18) return 'C1';
  return 'C2';
}

// Helper function to calculate difficulty based on sentence characteristics
function calculateDifficulty(sentence: string): number {
  const length = sentence.length;
  const complexityFactors = [
    sentence.includes('XÀÌ') ? 10 : 0,    // Conjunctions
    sentence.includes('t') ? 10 : 0,      // Complex endings
    sentence.includes('$à') ? 10 : 0,      // Purpose expressions
    sentence.includes('øðÀ') ? 10 : 0,    // Uncertainty expressions
  ];

  const baseScore = Math.min(length, 50);  // Length-based difficulty
  const complexityBonus = complexityFactors.reduce((a, b) => a + b, 0);

  return Math.min(baseScore + complexityBonus, 100);
}

// Run migration
migrateSpeechProData()
  .then(() => {
    console.log('<‰ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('=¥ Migration script failed:', error);
    process.exit(1);
  });
