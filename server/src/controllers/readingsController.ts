import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { PhotoProcessingService } from '../services/PhotoProcessingService';
import { AppDataSource } from '../config/database';
import { SkyReading } from '../models/SkyReading';
import path from 'path';

const photoService = new PhotoProcessingService();
const readingRepository = AppDataSource.getRepository(SkyReading);

export const uploadPhotoValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  body('location_name').optional().isString(),
  body('city').optional().isString(),
  body('country').optional().isString(),
  body('observation_datetime').optional().isISO8601(),
];

export const uploadPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { latitude, longitude, location_name, city, country, observation_datetime } = req.body;

    // Process the photo
    const reading = await photoService.processPhoto({
      filePath: req.file.path,
      fileName: req.file.filename,
      fileSize: req.file.size,
      userId: req.user?.userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName: location_name,
      city,
      country,
      observationDatetime: observation_datetime
        ? new Date(observation_datetime)
        : undefined,
    });

    res.status(201).json({
      message: 'Photo uploaded and analyzed successfully',
      reading,
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Failed to process photo' });
  }
};

export const getReadingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const reading = await photoService.getReadingWithPhoto(id);

    if (!reading) {
      res.status(404).json({ error: 'Reading not found' });
      return;
    }

    res.json({ reading });
  } catch (error) {
    console.error('Get reading error:', error);
    res.status(500).json({ error: 'Failed to get reading' });
  }
};

export const getReadingsValidation = [
  query('user_id').optional().isUUID(),
  query('country').optional().isString(),
  query('min_bortle').optional().isInt({ min: 1, max: 9 }),
  query('max_bortle').optional().isInt({ min: 1, max: 9 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
];

export const getReadings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      user_id,
      country,
      min_bortle,
      max_bortle,
      limit = 20,
      offset = 0,
    } = req.query;

    const { readings, total } = await photoService.getReadings({
      userId: user_id as string,
      country: country as string,
      minBortle: min_bortle ? parseInt(min_bortle as string) : undefined,
      maxBortle: max_bortle ? parseInt(max_bortle as string) : undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json({
      readings,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'Failed to get readings' });
  }
};

export const getMapData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all readings with minimal data for map display
    const readings = await readingRepository
      .createQueryBuilder('reading')
      .select([
        'reading.id',
        'reading.latitude',
        'reading.longitude',
        'reading.bortle_scale',
        'reading.sqm_value',
        'reading.light_pollution_level',
        'reading.location_name',
        'reading.city',
        'reading.country',
      ])
      .orderBy('reading.observation_datetime', 'DESC')
      .limit(1000) // Limit for performance
      .getMany();

    res.json({ readings });
  } catch (error) {
    console.error('Get map data error:', error);
    res.status(500).json({ error: 'Failed to get map data' });
  }
};

export const getStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalReadings = await readingRepository.count();

    const avgBortle = await readingRepository
      .createQueryBuilder('reading')
      .select('AVG(reading.bortle_scale)', 'avg')
      .getRawOne();

    const avgSqm = await readingRepository
      .createQueryBuilder('reading')
      .select('AVG(reading.sqm_value)', 'avg')
      .getRawOne();

    const bestReading = await readingRepository.findOne({
      where: {},
      order: { sqm_value: 'DESC' },
    });

    const worstReading = await readingRepository.findOne({
      where: {},
      order: { sqm_value: 'ASC' },
    });

    const countryStats = await readingRepository
      .createQueryBuilder('reading')
      .select('reading.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(reading.bortle_scale)', 'avg_bortle')
      .groupBy('reading.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    res.json({
      statistics: {
        total_readings: totalReadings,
        average_bortle: parseFloat(avgBortle?.avg || 0).toFixed(1),
        average_sqm: parseFloat(avgSqm?.avg || 0).toFixed(2),
        best_reading: bestReading,
        worst_reading: worstReading,
        top_countries: countryStats,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
