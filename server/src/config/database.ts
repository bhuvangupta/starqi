import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Import entities
import { User } from '../models/User';
import { SkyReading } from '../models/SkyReading';
import { PhotoUpload } from '../models/PhotoUpload';
import { SqmDevice } from '../models/SqmDevice';
import { Location } from '../models/Location';
import { Contribution } from '../models/Contribution';
import { ImpactMetric } from '../models/ImpactMetric';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'starqi',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [User, SkyReading, PhotoUpload, SqmDevice, Location, Contribution, ImpactMetric],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};
