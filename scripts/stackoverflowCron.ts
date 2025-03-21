import {
  fetchTrendingQuestions,
  fetchAnsweredQuestions,
  fetchDetailedTopVotedAnswers,
} from '../lib/stackoverflow';
import prisma from '../lib/db';

async function run() {
  try {
    console.log('Starting Stack Overflow cron job...');

    // 1. Fetch trending questions (without tag filter) and upsert them into the DB
    const trendingQuestions = await fetchTrendingQuestions();
    console.log(`Fetched trending questions: ${trendingQuestions.length}`);

    for (const question of trendingQuestions) {
      await prisma.stackOverflowQuestion.upsert({
        where: { id: question.id },
        update: {
          title: question.title,
          link: question.link,
          viewCount: question.viewCount,
          answerCount: question.answerCount,
          score: question.score,
          tags: question.tags,
          isAnswered: question.isAnswered,
          creationDate: new Date(question.creationDate),
        },
        create: {
          id: question.id,
          title: question.title,
          link: question.link,
          viewCount: question.viewCount,
          answerCount: question.answerCount,
          score: question.score,
          tags: question.tags,
          isAnswered: question.isAnswered,
          creationDate: new Date(question.creationDate),
        },
      });
    }

    // 2. Fetch answered questions trend and update them in the DB
    const answeredQuestions = await fetchAnsweredQuestions();
    console.log(`Fetched answered questions: ${answeredQuestions.length}`);

    for (const question of answeredQuestions) {
      await prisma.stackOverflowQuestion.update({
        where: { id: question.id },
        data: { isAnswered: true },
      });
    }

    // 3. Fetch top-voted answers with full details and upsert them into the DB
    const topVotedAnswers = await fetchDetailedTopVotedAnswers();
    console.log(`Fetched top voted answers: ${topVotedAnswers.length}`);

    for (const answer of topVotedAnswers) {
      await prisma.stackOverflowAnswer.upsert({
        where: { id: answer.id },
        update: {
          questionId: answer.questionId,
          link: answer.link || '', // Fallback: empty string if link is undefined
          score: answer.score,
          isAccepted: answer.isAccepted,
          creationDate: new Date(answer.creationDate),
        },
        create: {
          id: answer.id,
          questionId: answer.questionId,
          link: answer.link || '', // Fallback: empty string if link is undefined
          score: answer.score,
          isAccepted: answer.isAccepted,
          creationDate: new Date(answer.creationDate),
        },
      });
    }

    console.log('Stack Overflow data saved to DB successfully.');
  } catch (error) {
    console.error('Error in Stack Overflow cron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
