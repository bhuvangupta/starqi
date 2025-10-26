import cron from 'node-cron';
import { sqmCrawler } from '../services/sqmCrawler';

/**
 * SQM Data Crawler Scheduler
 *
 * Automatically runs the SQM crawler at scheduled intervals.
 * Enable by setting ENABLE_SQM_SCHEDULER=true in .env
 */

const ENABLE_SCHEDULER = process.env.ENABLE_SQM_SCHEDULER === 'true';
const CRON_SCHEDULE = process.env.SQM_CRON_SCHEDULE || '0 2 * * *'; // Default: Daily at 2 AM

if (ENABLE_SCHEDULER) {
  console.log('🤖 SQM Crawler Scheduler: ENABLED');
  console.log(`📅 Schedule: ${CRON_SCHEDULE}`);

  // Validate cron expression
  if (!cron.validate(CRON_SCHEDULE)) {
    console.error('❌ Invalid cron schedule:', CRON_SCHEDULE);
    console.error('   Using default: 0 2 * * * (Daily at 2 AM)');
  }

  // Schedule the crawler
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('\n⏰ Running scheduled SQM crawler...');
    console.log(`   Time: ${new Date().toISOString()}\n`);

    try {
      await sqmCrawler.crawlAll();
      console.log('\n✅ Scheduled crawler completed successfully\n');
    } catch (error: any) {
      console.error('\n❌ Scheduled crawler failed:', error.message);
      console.error(error.stack);
      console.log('');
    }
  });

  console.log('✅ SQM Crawler scheduled successfully\n');

  // Optionally run once on startup
  if (process.env.SQM_RUN_ON_STARTUP === 'true') {
    console.log('🚀 Running crawler on startup...\n');
    setTimeout(async () => {
      try {
        await sqmCrawler.crawlAll();
        console.log('\n✅ Startup crawler completed\n');
      } catch (error: any) {
        console.error('\n❌ Startup crawler failed:', error.message);
      }
    }, 5000); // Wait 5 seconds for server to fully initialize
  }
} else {
  console.log('⏸️  SQM Crawler Scheduler: DISABLED');
  console.log('   To enable, set ENABLE_SQM_SCHEDULER=true in .env\n');
}

/**
 * Common Cron Schedule Examples:
 *
 * Every day at 2 AM:        0 2 * * *
 * Every 6 hours:            0 *//*6 * * *
 * Every Sunday at 3 AM:     0 3 * * 0
 * Every 1st of month:       0 0 1 * *
 * Every Monday at 9 AM:     0 9 * * 1
 * Twice daily (6 AM, 6 PM): 0 6,18 * * *
 */
