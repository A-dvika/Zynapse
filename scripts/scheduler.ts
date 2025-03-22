// scripts/scheduler.ts
import cron from 'node-cron';
import { spawn } from 'child_process';

/**
 * Utility to run a TypeScript script with "npx tsx".
 * @param scriptName - The file name of the script in the "scripts" folder.
 */
function runScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // e.g., "npx tsx scripts/redditCron.ts"
    const process = spawn('npx', ['tsx', `scripts/${scriptName}`], {
      stdio: 'inherit', // show script logs in console
      shell: true,      // needed for cross-platform compatibility
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Daily Tasks at 2:00 AM
//    "0 2 * * *" => At 02:00 every day
// ─────────────────────────────────────────────────────────────────────────────
cron.schedule('0 2 * * *', async () => {
  console.log('[Cron] Starting daily data fetch tasks at 2:00 AM...');
  try {
    // Add whichever scripts you want to run daily:
    // e.g., aggregatorSummary, redditCron, hackerNewsCron, socialMediaCron, memesCron, stackOverflowCron, githubCron, etc.

    await runScript('ingestData.ts');
    await runScript('redditCron.ts');
    await runScript('hackerNewsCron.ts');
    await runScript('socialMediaCron.ts');
    await runScript('memesCron.ts');
    await runScript('stackoverflowCron.ts');
    await runScript('githubCron.ts');

    console.log('[Cron] Finished daily data fetch tasks.');
  } catch (error) {
    console.error('[Cron] Error in daily tasks:', error);
  }
}, {
  timezone: 'Asia/Kolkata', // Change to your preferred timezone
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Weekly Tasks at 6:00 AM on Monday
//    "0 6 * * 1" => At 06:00 every Monday
// ─────────────────────────────────────────────────────────────────────────────
cron.schedule('0 6 * * 1', async () => {
  console.log('[Cron] Starting weekly tasks at 6:00 AM on Monday...');
  try {
    // e.g., generateWeeklyReportChain => produce summary
    //       sendNewsletter => send the summary out

    await runScript('generateWeeklyReportChain.ts');
    await runScript('sendNewsletter.ts');

    console.log('[Cron] Finished weekly tasks.');
  } catch (error) {
    console.error('[Cron] Error in weekly tasks:', error);
  }
}, {
  timezone: 'Asia/Kolkata',
});

console.log('[Cron] Scheduler started, waiting for tasks to trigger...');
