import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../models/Word';

dotenv.config();

/**
 * Analyze pronunciation rules for a Korean word
 * This is a simplified version - can be enhanced with more sophisticated logic
 */
function analyzePronunciation(word: string): string[] {
  const rules: string[] = [];

  // Check for 연음 (liaison) - simplified check
  if (/[ㄱ-ㅎ][ㅏ-ㅣ]/g.test(word)) {
    rules.push('연음');
  }

  // Check for 비음화 (nasalization)
  if (/(국|밥|꽃)[물만]/g.test(word) || word.includes('ㄱㄴ') || word.includes('ㅂㅁ')) {
    rules.push('비음화');
  }

  // Check for 유음화 (liquidization)
  if (word.includes('ㄴㄹ') || word.includes('ㄹㄴ')) {
    rules.push('유음화');
  }

  // Check for 구개음화 (palatalization)
  if (/[ㄷㅌ]이/g.test(word)) {
    rules.push('구개음화');
  }

  // Check for 경음화 (tensification)
  if (/[ㄱㄷㅂㅅㅈ][ㄱㄷㅂㅅㅈ]/g.test(word)) {
    rules.push('경음화');
  }

  return rules;
}

/**
 * Generate standard pronunciation
 * This is a placeholder - can be enhanced with actual pronunciation rules
 */
function generatePronunciation(word: string, pronunciation: string): string {
  // For now, just use the existing pronunciation field
  // Can be enhanced to apply actual phonological rules
  return pronunciation;
}

/**
 * Migrate existing flower words to new schema
 */
async function migrateFlowerWords() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urimalzen';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Find all flower words
    const flowers = await Word.find({ category: 'flower' });
    console.log(`Found ${flowers.length} flower words to migrate`);

    let migratedCount = 0;

    for (const flower of flowers) {
      // Analyze pronunciation rules
      const phonemeRules = analyzePronunciation(flower.koreanWord);

      // Generate standard pronunciation
      const standardPronunciation = generatePronunciation(
        flower.koreanWord,
        flower.pronunciation
      );

      // Update with new fields
      await Word.findByIdAndUpdate(flower._id, {
        $set: {
          level: {
            kiip: 1,
            cefr: 'A1',
          },
          mainCategory: '자연과 환경',
          subCategory: '꽃',
          phonemeRules: phonemeRules,
          standardPronunciation: standardPronunciation,
          antonyms: [],
          collocations: [],
          relatedWords: [],
          difficultyScore: 20,
          frequencyRank: 0,
          wordType: 'noun',
          formalityLevel: 'neutral',
          culturalNote: '',
        },
      });

      migratedCount++;
      console.log(
        `✅ Migrated: ${flower.koreanWord} (${flower.mongolianWord}) - Rules: [${phonemeRules.join(', ')}]`
      );
    }

    console.log(`\n🎉 Successfully migrated ${migratedCount} flower words!`);
    console.log('\nMigration details:');
    console.log('- KIIP Level: 1 (초급)');
    console.log('- CEFR Level: A1');
    console.log('- Main Category: 자연과 환경');
    console.log('- Sub Category: 꽃');
    console.log('- Difficulty Score: 20 (초급)');
    console.log('- Word Type: noun');
    console.log('- Formality Level: neutral');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error migrating flower words:', error);
    process.exit(1);
  }
}

migrateFlowerWords();
