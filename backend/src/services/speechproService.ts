import axios from 'axios';

const SPEECHPRO_API_URL = process.env.SPEECHPRO_API_URL || 'http://112.220.79.222:33005/speechpro';

export interface GTPRequest {
  id: string;
  text: string;
}

export interface GTPResponse {
  id: string;
  text: string;
  'syll ltrs': string;
  'syll phns': string;
  'error code': number;
}

export interface ModelRequest {
  id: string;
  text: string;
  'syll ltrs': string;
  'syll phns': string;
}

export interface ModelResponse {
  id: string;
  text: string;
  'syll ltrs': string;
  'syll phns': string;
  fst: string;
  'error code': number;
}

export interface ScoreRequest {
  id: string;
  text: string;
  'syll ltrs': string;
  'syll phns': string;
  fst: string;
  'wav usr': string; // Base64 encoded WAV
}

export interface ScoreResponse {
  score: number;
  details?: any;
  'error code': number;
}

// 공백 정규화 함수 (NBSP 등 특수 공백을 일반 공백으로 변환)
export function normalizeSpaces(text: string): string {
  return text
    .replace(/[\u00A0\u2002\u2003\u2009\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function callGTP(request: GTPRequest): Promise<GTPResponse> {
  const data = {
    id: request.id,
    text: normalizeSpaces(request.text),
  };
  const res = await axios.post(`${SPEECHPRO_API_URL}/gtp`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}

export async function callModel(request: ModelRequest): Promise<ModelResponse> {
  const data = {
    id: request.id,
    text: normalizeSpaces(request.text),
    'syll ltrs': request['syll ltrs'],
    'syll phns': request['syll phns'],
  };
  const res = await axios.post(`${SPEECHPRO_API_URL}/model`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
}

export async function callScore(request: ScoreRequest): Promise<ScoreResponse> {
  const data = {
    id: request.id,
    text: normalizeSpaces(request.text),
    'syll ltrs': request['syll ltrs'],
    'syll phns': request['syll phns'],
    fst: request.fst,
    'wav usr': request['wav usr'],
  };
  const res = await axios.post(`${SPEECHPRO_API_URL}/scorejson`, data, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  });
  return res.data;
}
