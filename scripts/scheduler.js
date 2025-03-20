const cron = require('node-cron');
const { exec } = require('child_process');

// Runs every hour at minute 0
cron.schedule('0 * * * *', () => {
  console.log('Running githubCron script...');
  exec('npx tsx scripts/githubCron.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
});
