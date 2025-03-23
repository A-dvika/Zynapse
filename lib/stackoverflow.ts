import axios from 'axios';

const STACKOVERFLOW_API_URL = 'https://api.stackexchange.com/2.3';
const defaultParams = {
  site: 'stackoverflow',
  pagesize: 10,
};

interface Question {
  id: number;
  title: string;
  link: string;
  viewCount: number;
  answerCount: number;
  score: number;
  tags: string[];
  isAnswered: boolean;
  creationDate: string;
}

interface Answer {
  id: number;
  questionId: number;
  link: string;
  score: number;
  isAccepted: boolean;
  body: string;
  creationDate: string;
}

export async function fetchTrendingQuestions(): Promise<Question[]> {
  const url = `${STACKOVERFLOW_API_URL}/questions`;
  const params = {
    ...defaultParams,
    order: 'desc',
    sort: 'votes',
    filter: '!9_bDE(fI5',
  };

  const response = await axios.get(url, { params });
  return response.data.items.map((q: { question_id: number; title: string; link: string; view_count: number; answer_count: number; score: number; tags: string[]; is_answered: boolean; creation_date: number; }) => ({
    id: q.question_id,
    title: q.title,
    link: q.link,
    viewCount: q.view_count,
    answerCount: q.answer_count,
    score: q.score,
    tags: q.tags,
    isAnswered: q.is_answered,
    creationDate: new Date(q.creation_date * 1000).toISOString(),
  }));
}


export async function fetchAnsweredQuestions(): Promise<Question[]> {
  const allQuestions = await fetchTrendingQuestions();
  return allQuestions.filter((q) => q.isAnswered);
}


export async function fetchDetailedTopVotedAnswers(): Promise<Answer[]> {
  const url = `${STACKOVERFLOW_API_URL}/answers`;
  const params = {
    ...defaultParams,
    order: 'desc',
    sort: 'votes',
    filter: 'withbody',
  };

  const response = await axios.get(url, { params });
  return response.data.items.map((a: { answer_id: number; question_id: number; link: string; score: number; is_accepted: boolean; body: string; creation_date: number; }) => ({
    id: a.answer_id,
    questionId: a.question_id,
    link: a.link,
    score: a.score,
    isAccepted: a.is_accepted,
    body: a.body, 
    creationDate: new Date(a.creation_date * 1000).toISOString(),
  }));
}
