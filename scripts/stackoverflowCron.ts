import {
    fetchTrendingQuestions,
    fetchAnsweredQuestions,
    fetchTopVotedAnswers,
  } from '../lib/stackoverflow';
  import prisma from '../lib/db';
  
  async function run() {
    try {
      // 1. Fetch trending questions (no tag filter)
      const trendingQuestions = await fetchTrendingQuestions();
      console.log('Fetched trending questions:', trendingQuestions.length);
  
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
  
      // 2. Fetch answered questions trend (questions that are answered)
      const answeredQuestions = await fetchAnsweredQuestions();
      console.log('Fetched answered questions:', answeredQuestions.length);
  
      // Optionally, you can save answered questions to a separate table or update them in the same table.
      // Here, we simply update the same question records. For example:
      for (const question of answeredQuestions) {
        await prisma.stackOverflowQuestion.update({
          where: { id: question.id },
          data: { isAnswered: true },
        });
      }
  
      // 3. Fetch top-voted answers
      const topVotedAnswers = await fetchTopVotedAnswers();
      console.log('Fetched top voted answers:', topVotedAnswers.length);
  // In scripts/stackoverflowCron.ts, within the loop for topVotedAnswers
for (const answer of topVotedAnswers) {
    await prisma.stackOverflowAnswer.upsert({
      where: { id: answer.id },
      update: {
        questionId: answer.questionId,
        link: answer.link || '',  // Fallback: empty string if link is undefined
        score: answer.score,
        isAccepted: answer.isAccepted,
        creationDate: new Date(answer.creationDate),
      },
      create: {
        id: answer.id,
        questionId: answer.questionId,
        link: answer.link || '',  // Fallback: empty string if link is undefined
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
  