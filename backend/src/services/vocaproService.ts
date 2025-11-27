import axios from 'axios';

const VOCAPRO_API_URL = process.env.VOCAPRO_API_URL || 'https://api.vocapro.example.com';
const VOCAPRO_API_KEY = process.env.VOCAPRO_API_KEY || '';

export interface VocaProAnalysisRequest {
  text: string;
  task_id?: string;
  lang: 'kor' | 'chi' | 'jpn' | 'eng';
  wsd_model_size?: 'small' | 'large';
  spacy_model_size?: 'small' | 'large';
}

export interface Morpheme {
  surface: string;        // Original form
  lemma: string;          // Base form
  pos: string;            // Part of speech
  definition?: string;    // Definition
  synonyms?: string[];    // Synonyms
  antonyms?: string[];    // Antonyms
}

export interface Word {
  word: string;
  lemma: string;
  pos: string;
  definition?: string;
  synonyms?: string[];
  antonyms?: string[];
  cefr_level?: string;    // A1, A2, B1, B2, C1, C2
  difficulty_score?: number;
}

export interface Sentence {
  text: string;
  words: Word[];
}

export interface VocaProAnalysisResponse {
  task_id: string;
  lang: string;
  sentences: Sentence[];
  morphemes: Morpheme[];
  error?: string;
  error_code?: number;
}

/**
 * Analyze Korean text using VocaPro API
 * @param request Analysis request with text and options
 * @returns Comprehensive linguistic analysis
 */
export async function analyzeText(request: VocaProAnalysisRequest): Promise<VocaProAnalysisResponse> {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (VOCAPRO_API_KEY) {
      headers['Authorization'] = `Bearer ${VOCAPRO_API_KEY}`;
    }

    const response = await axios.post(
      `${VOCAPRO_API_URL}/analyze`,
      {
        text: request.text,
        task_id: request.task_id || generateTaskId(),
        lang: request.lang,
        wsd_model_size: request.wsd_model_size || 'small',
        spacy_model_size: request.spacy_model_size || 'small',
      },
      {
        headers,
        timeout: 60000, // 60 seconds for complex analysis
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('VocaPro API error:', error.response?.data || error.message);
    throw new Error(`VocaPro analysis failed: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Extract word metadata from VocaPro analysis for Word schema
 * @param analysisResult Full VocaPro analysis result
 * @returns Extracted metadata suitable for Word.vocaPro field
 */
export function extractWordMetadata(analysisResult: VocaProAnalysisResponse) {
  const morphemes = analysisResult.morphemes || [];
  const words = analysisResult.sentences?.[0]?.words || [];

  // Extract unique synonyms and antonyms
  const synonymsSet = new Set<string>();
  const antonymsSet = new Set<string>();
  const definitionsArray: Array<{ definition: string; definitionMn?: string }> = [];

  words.forEach((word) => {
    if (word.synonyms) {
      word.synonyms.forEach((syn) => synonymsSet.add(syn));
    }
    if (word.antonyms) {
      word.antonyms.forEach((ant) => antonymsSet.add(ant));
    }
    if (word.definition) {
      definitionsArray.push({ definition: word.definition });
    }
  });

  // Get CEFR analysis from first word
  const firstWord = words[0];
  const cefrAnalysis = firstWord
    ? {
        level: firstWord.cefr_level || '',
        score: firstWord.difficulty_score || 0,
      }
    : undefined;

  return {
    morphemes: morphemes.map((m) => ({
      surface: m.surface,
      lemma: m.lemma,
      pos: m.pos,
    })),
    definitions: definitionsArray,
    cefrAnalysis,
    synonymsExtended: Array.from(synonymsSet),
    antonymsExtended: Array.from(antonymsSet),
    lastUpdated: new Date(),
    errorCode: analysisResult.error_code || 0,
  };
}

/**
 * Test VocaPro API connection
 * @returns True if connection successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const testResult = await analyzeText({
      text: '안녕하세요',
      lang: 'kor',
    });
    return testResult.error_code === 0 || testResult.error_code === undefined;
  } catch (error) {
    console.error('VocaPro connection test failed:', error);
    return false;
  }
}

/**
 * Generate unique task ID for VocaPro requests
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Batch analyze multiple words
 * @param texts Array of Korean texts to analyze
 * @returns Array of analysis results
 */
export async function batchAnalyzeTexts(
  texts: string[]
): Promise<Array<{ text: string; result: VocaProAnalysisResponse | null; error?: string }>> {
  const results = [];

  for (const text of texts) {
    try {
      const result = await analyzeText({ text, lang: 'kor' });
      results.push({ text, result });

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: any) {
      console.error(`Failed to analyze "${text}":`, error.message);
      results.push({ text, result: null, error: error.message });
    }
  }

  return results;
}
