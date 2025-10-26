#!/usr/bin/env ts-node

import 'reflect-metadata';
import { initializeDatabase } from '../config/database';
import { SQMHistoricalCrawler } from '../services/sqmHistoricalCrawler';

/**
 * CLI Script to crawl historical SQM data (last 6 months)
 *
 * Usage:
 *   npm run crawl-sqm-history
 *   npm run crawl-sqm-history 3    # Last 3 months
 *   npm run crawl-sqm-history 12   # Last 12 months
 *
 * This script will:
 * 1. Connect to the database
 * 2. Fetch SQM readings from the last N months
 * 3. Generate historical sample data for multiple locations
 * 4. Save readings to the database (avoiding duplicates)
 *
 * Note: This is a ONE-TIME operation. Use the regular crawler
 * for ongoing updates.
 */

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SkyQI - Historical SQM Data Crawler');
  console.log('   One-Time Bulk Import');
  console.log('═══════════════════════════════════════════════════\n');

  // Get months from command line argument, default to 6
  const monthsBack = parseInt(process.argv[2] || '6', 10);

  if (isNaN(monthsBack) || monthsBack < 1 || monthsBack > 24) {
    console.error('❌ Invalid months parameter. Must be between 1 and 24.');
    console.error('   Usage: npm run crawl-sqm-history [months]');
    console.error('   Example: npm run crawl-sqm-history 6\n');
    process.exit(1);
  }

  console.log(`⏳ Importing last ${monthsBack} month(s) of data...`);
  console.log(`⚠️  This may take several minutes.\n`);

  // Confirm before proceeding
  if (process.env.SKIP_CONFIRMATION !== 'true') {
    console.log('⚡ This will import a large amount of historical data.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  try {
    // Initialize database connection
    console.log('🔌 Connecting to database...');
    await initializeDatabase();
    console.log('✅ Database connected\n');

    // Create crawler instance
    const crawler = new SQMHistoricalCrawler(monthsBack);

    // Run the crawler
    const startTime = Date.now();
    await crawler.crawlHistorical();
    const endTime = Date.now();

    const duration = ((endTime - startTime) / 1000).toFixed(1);

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✨ Historical crawler finished successfully!');
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Historical crawler failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error: any) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error: any) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the script
main();
