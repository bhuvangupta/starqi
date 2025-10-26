import 'reflect-metadata';
import dotenv from 'dotenv';
import { initializeDatabase } from '../config/database';
import { PhotoCrawlerService } from '../services/PhotoCrawlerService';

// Load environment variables
dotenv.config();

/**
 * Photo Crawler Script
 *
 * Usage:
 *   npm run crawl-photos [nasa_count] [unsplash_count] [eso_count] [darksky_count]
 *
 * Examples:
 *   npm run crawl-photos              # Default: 10 NASA, 20 Unsplash, 10 ESO, 5 Dark Sky
 *   npm run crawl-photos 0 0 20 0     # Only ESO: 20 photos
 *   npm run crawl-photos 0 0 15 10    # ESO: 15, Dark Sky: 10
 *
 * Environment Variables:
 *   NASA_API_KEY         - NASA API key (optional, uses DEMO_KEY if not set)
 *   UNSPLASH_ACCESS_KEY  - Unsplash API access key (required for Unsplash)
 */

const main = async () => {
  try {
    // Parse command line arguments (handle 0 as valid input)
    const nasaCount = process.argv[2] !== undefined ? parseInt(process.argv[2]) : 10;
    const unsplashCount = process.argv[3] !== undefined ? parseInt(process.argv[3]) : 20;
    const esoCount = process.argv[4] !== undefined ? parseInt(process.argv[4]) : 10;
    const darkSkyCount = process.argv[5] !== undefined ? parseInt(process.argv[5]) : 5;

    console.log('🌌 SkyQI Photo Crawler');
    console.log('='.repeat(60));
    console.log(`NASA APOD Photos: ${nasaCount}`);
    console.log(`Unsplash Photos: ${unsplashCount}`);
    console.log(`ESO Photos: ${esoCount}`);
    console.log(`Dark Sky Parks: ${darkSkyCount}`);
    console.log('='.repeat(60) + '\n');

    // Initialize database
    console.log('📦 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database connected\n');

    // Create crawler instance
    const crawler = new PhotoCrawlerService();

    // Run crawlers
    await crawler.crawlAll(nasaCount, unsplashCount, esoCount, darkSkyCount);

    console.log('\n✅ Photo crawling completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error running photo crawler:', error);
    process.exit(1);
  }
};

main();
