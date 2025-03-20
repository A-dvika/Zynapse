import axios from 'axios';

const STACKOVERFLOW_API_URL = 'https://api.stackexchange.com/2.3';
const defaultParams = {
  site: 'stackoverflow',
  pagesize: 10,
};

/**
 * Fetch trending questions (sorted by votes) without filtering by tags.
 */
export async function fetchTrendingQuestions(): Promise<any[]> {
  const url = `${STACKOVERFLOW_API_URL}/questions`;
  const params = {
    ...defaultParams,
    order: 'desc',
    sort: 'votes',
    filter: '!9_bDE(fI5', // Adjust filter as needed
  };

  const response = await axios.get(url, { params });
  return response.data.items.map((q: any) => ({
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

/**
 * Fetch answered questions trend by filtering the trending questions.
 */
export async function fetchAnsweredQuestions(): Promise<any[]> {
  const allQuestions = await fetchTrendingQuestions();
  return allQuestions.filter((q: any) => q.isAnswered);
}

/**
 * Fetch top-voted answers across Stack Overflow.
 */
export async function fetchTopVotedAnswers(): Promise<any[]> {
  const url = `${STACKOVERFLOW_API_URL}/answers`;
  const params = {
    ...defaultParams,
    order: 'desc',
    sort: 'votes',
    filter: '!9_bDE(fI5',
  };

  const response = await axios.get(url, { params });
  return response.data.items.map((a: any) => ({
    id: a.answer_id,
    questionId: a.question_id,
    link: a.link,
    score: a.score,
    isAccepted: a.is_accepted,
    creationDate: new Date(a.creation_date * 1000).toISOString(),
  }));
}
