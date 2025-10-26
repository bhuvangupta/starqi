import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { SkyReading } from '../models/SkyReading';

const userRepository = AppDataSource.getRepository(User);
const readingRepository = AppDataSource.getRepository(SkyReading);

/**
 * Get user profile statistics
 * GET /api/users/:userId/stats or /api/users/me/stats
 */
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // If userId is 'me', get from authenticated user
    const targetUserId = userId === 'me' ? req.user?.userId : userId;

    if (!targetUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user details
    const user = await userRepository.findOne({
      where: { id: targetUserId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // 1. Total readings count
    const totalReadings = await readingRepository.count({
      where: { user_id: targetUserId }
    });

    // 2. User rank (based on reading count)
    const userRankResult = await readingRepository.query(`
      SELECT
        user_id,
        COUNT(*) as reading_count,
        RANK() OVER (ORDER BY COUNT(*) DESC) as user_rank
      FROM sky_readings
      WHERE user_id IS NOT NULL
      GROUP BY user_id
    `);

    const userRankData = userRankResult.find((r: any) => r.user_id === targetUserId);
    const rank = userRankData ? parseInt(userRankData.user_rank) : null;

    // 3. Best reading (highest SQM value / lowest Bortle)
    const bestReading = await readingRepository
      .createQueryBuilder('reading')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .orderBy('reading.sqm_value', 'DESC')
      .limit(1)
      .getOne();

    // 4. Recent 5 readings
    const recentReadings = await readingRepository
      .createQueryBuilder('reading')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .orderBy('reading.observation_datetime', 'DESC')
      .limit(5)
      .getMany();

    // 5. Additional stats
    const avgSqm = await readingRepository
      .createQueryBuilder('reading')
      .select('AVG(reading.sqm_value)', 'avgSqm')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .getRawOne();

    const avgBortle = await readingRepository
      .createQueryBuilder('reading')
      .select('AVG(reading.bortle_scale)', 'avgBortle')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .getRawOne();

    // 6. Cities covered
    const citiesResult = await readingRepository
      .createQueryBuilder('reading')
      .select('DISTINCT reading.city')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .andWhere('reading.city IS NOT NULL')
      .getRawMany();

    const citiesCount = citiesResult.length;

    // 7. Countries covered
    const countriesResult = await readingRepository
      .createQueryBuilder('reading')
      .select('DISTINCT reading.country')
      .where('reading.user_id = :userId', { userId: targetUserId })
      .andWhere('reading.country IS NOT NULL')
      .getRawMany();

    const countriesCount = countriesResult.length;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        state: user.state,
        country: user.country,
        created_at: user.created_at,
      },
      stats: {
        totalReadings,
        rank,
        bestReading: bestReading ? {
          id: bestReading.id,
          location_name: bestReading.location_name,
          city: bestReading.city,
          country: bestReading.country,
          sqm_value: bestReading.sqm_value,
          bortle_scale: bestReading.bortle_scale,
          light_pollution_level: bestReading.light_pollution_level,
          observation_datetime: bestReading.observation_datetime,
        } : null,
        averageSqm: avgSqm?.avgSqm ? parseFloat(avgSqm.avgSqm).toFixed(2) : null,
        averageBortle: avgBortle?.avgBortle ? parseFloat(avgBortle.avgBortle).toFixed(1) : null,
        citiesCount,
        countriesCount,
        recentReadings: recentReadings.map(r => ({
          id: r.id,
          location_name: r.location_name,
          city: r.city,
          country: r.country,
          sqm_value: r.sqm_value,
          bortle_scale: r.bortle_scale,
          light_pollution_level: r.light_pollution_level,
          observation_datetime: r.observation_datetime,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
};

/**
 * Get user's reading history with pagination
 * GET /api/users/:userId/readings
 */
export const getUserReadings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // If userId is 'me', get from authenticated user
    const targetUserId = userId === 'me' ? req.user?.userId : userId;

    if (!targetUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [readings, total] = await readingRepository.findAndCount({
      where: { user_id: targetUserId },
      order: { observation_datetime: 'DESC' },
      take: limit,
      skip,
    });

    res.json({
      readings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching user readings:', error);
    res.status(500).json({ error: 'Failed to fetch user readings' });
  }
};
