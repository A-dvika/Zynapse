import { NextResponse } from 'next/server';
import { ingestData } from '../../../scripts/ingestData';
import { redditCron } from '../../../scripts/redditCron';
import { hackerNewsCron } from '../../../scripts/hackerNewsCron';
import { socialMediaCron } from '../../../scripts/socialMediaCron';
import { memesCron } from '../../../scripts/memesCron';
import { stackoverflowCron } from '../../../scripts/stackoverflowCron';
import { githubCron } from '../../../scripts/githubCron';

export async function GET(request: Request) {
  // Check for the correct Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log('[Cron] Starting daily data fetch tasks...');
  
  try {
    // Execute your tasks sequentially (or in parallel if independent)
    await ingestData();
    await redditCron();
    await hackerNewsCron();
    await socialMediaCron();
    await memesCron();
    await stackoverflowCron();
    await githubCron();

    console.log('[Cron] Finished daily data fetch tasks.');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Cron] Error in daily tasks:', error);
    return NextResponse.json({ error: 'Daily tasks failed' }, { status: 500 });
  }
}
