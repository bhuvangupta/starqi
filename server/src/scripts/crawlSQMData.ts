#!/usr/bin/env ts-node

import 'reflect-metadata';
import { initializeDatabase } from '../config/database';
import { sqmCrawler } from '../services/sqmCrawler';

/**
 * CLI Script to crawl SQM data from public sources
 *
 * Usage:
 *   npm run crawl-sqm
 *
 * This script will:
 * 1. Connect to the database
 * 2. Fetch SQM readings from multiple public sources
 * 3. Parse and validate the data
 * 4. Save new readings to the database (avoiding duplicates)
 */

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   SkyQI - SQM Data Crawler');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Initialize database connection
    console.log('🔌 Connecting to database...');
    await initializeDatabase();
    console.log('✅ Database connected\n');

    // Run the crawler
    await sqmCrawler.crawlAll();

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✨ Crawler finished successfully!');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Crawler failed:', error.message);
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
