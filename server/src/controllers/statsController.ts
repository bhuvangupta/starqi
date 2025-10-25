import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { SkyReading } from '../models/SkyReading';
import { ImpactMetric } from '../models/ImpactMetric';

/**
 * Get comprehensive impact metrics for dashboard
 * Combines automated metrics from database with manually updated metrics
 */
export const getImpactMetrics = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const readingRepo = AppDataSource.getRepository(SkyReading);
    const metricRepo = AppDataSource.getRepository(ImpactMetric);

    // Automated metrics from database
    const totalUsers = await userRepo.count();
    const totalReadings = await readingRepo.count();

    // Unique countries
    const countriesResult = await readingRepo
      .createQueryBuilder('reading')
      .select('COUNT(DISTINCT reading.country)', 'count')
      .getRawOne();
    const countries = parseInt(countriesResult?.count || '0');

    // Cities in India
    const indianCitiesResult = await readingRepo
      .createQueryBuilder('reading')
      .select('COUNT(DISTINCT reading.city)', 'count')
      .where('reading.country = :country', { country: 'India' })
      .getRawOne();
    const citiesInIndia = parseInt(indianCitiesResult?.count || '0');

    // Active users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const activeThisMonthResult = await readingRepo
      .createQueryBuilder('reading')
      .select('COUNT(DISTINCT reading.user_id)', 'count')
      .where('reading.created_at >= :start', { start: startOfMonth })
      .andWhere('reading.user_id IS NOT NULL')
      .getRawOne();
    const activeThisMonth = parseInt(activeThisMonthResult?.count || '0');

    // Top 10 cities globally
    const topCities = await readingRepo
      .createQueryBuilder('reading')
      .select('reading.city', 'city')
      .addSelect('reading.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where('reading.city IS NOT NULL')
      .groupBy('reading.city, reading.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Top 10 cities in India
    const topIndianCities = await readingRepo
      .createQueryBuilder('reading')
      .select('reading.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('reading.country = :country', { country: 'India' })
      .andWhere('reading.city IS NOT NULL')
      .groupBy('reading.city')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Readings by country (top 10)
    const readingsByCountry = await readingRepo
      .createQueryBuilder('reading')
      .select('reading.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where('reading.country IS NOT NULL')
      .groupBy('reading.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Growth data - readings by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const readingsByMonth = await readingRepo
      .createQueryBuilder('reading')
      .select("DATE_FORMAT(reading.created_at, '%Y-%m')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('reading.created_at >= :start', { start: sixMonthsAgo })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Users by month (last 6 months)
    const usersByMonth = await userRepo
      .createQueryBuilder('user')
      .select("DATE_FORMAT(user.created_at, '%Y-%m')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('user.created_at >= :start', { start: sixMonthsAgo })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Manual metrics from impact_metrics table
    const manualMetrics = await metricRepo.find();
    const manual = manualMetrics.reduce((acc: any, metric) => {
      acc[metric.metric_name] = metric.metric_value;
      return acc;
    }, {});

    // Response structure
    const response = {
      community: {
        totalUsers,
        totalReadings,
        countries,
        citiesInIndia,
        activeThisMonth,
      },
      geographic: {
        topCities: topCities.map(c => ({
          city: c.city,
          country: c.country,
          count: parseInt(c.count),
        })),
        topIndianCities: topIndianCities.map(c => ({
          city: c.city,
          count: parseInt(c.count),
        })),
        readingsByCountry: readingsByCountry.map(c => ({
          country: c.country,
          count: parseInt(c.count),
        })),
      },
      growth: {
        readingsByMonth: readingsByMonth.map(m => ({
          month: m.month,
          count: parseInt(m.count),
        })),
        usersByMonth: usersByMonth.map(m => ({
          month: m.month,
          count: parseInt(m.count),
        })),
      },
      manual: {
        schools: manual.schools_partnered || 0,
        workshops: manual.workshops_conducted || 0,
        studentsEngaged: manual.students_engaged || 0,
        mediaMentions: manual.media_mentions || 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    res.status(500).json({ error: 'Failed to fetch impact metrics' });
  }
};

/**
 * Get quick stats for About page (lighter version)
 */
export const getQuickStats = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const readingRepo = AppDataSource.getRepository(SkyReading);

    const totalUsers = await userRepo.count();
    const totalReadings = await readingRepo.count();

    const countriesResult = await readingRepo
      .createQueryBuilder('reading')
      .select('COUNT(DISTINCT reading.country)', 'count')
      .getRawOne();
    const countries = parseInt(countriesResult?.count || '0');

    res.json({
      totalUsers,
      totalReadings,
      countries,
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ error: 'Failed to fetch quick stats' });
  }
};

/**
 * Update manual metric (for admin use)
 * TODO: Add authentication middleware to protect this endpoint
 */
export const updateManualMetric = async (req: Request, res: Response) => {
  try {
    const { metricName } = req.params;
    const { value, updatedBy } = req.body;

    if (typeof value !== 'number' || value < 0) {
      return res.status(400).json({ error: 'Invalid value. Must be a non-negative number.' });
    }

    const metricRepo = AppDataSource.getRepository(ImpactMetric);

    let metric = await metricRepo.findOne({ where: { metric_name: metricName } });

    if (!metric) {
      return res.status(404).json({ error: 'Metric not found' });
    }

    metric.metric_value = value;
    metric.updated_by = updatedBy || 'admin';

    await metricRepo.save(metric);

    res.json({
      message: 'Metric updated successfully',
      metric: {
        name: metric.metric_name,
        value: metric.metric_value,
        lastUpdated: metric.last_updated,
      },
    });
  } catch (error) {
    console.error('Error updating manual metric:', error);
    res.status(500).json({ error: 'Failed to update metric' });
  }
};
