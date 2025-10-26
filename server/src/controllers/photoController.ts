import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { SkyReading } from '../models/SkyReading';
import { PhotoUpload, ProcessingStatus } from '../models/PhotoUpload';
import { User } from '../models/User';

const readingRepository = AppDataSource.getRepository(SkyReading);
const photoRepository = AppDataSource.getRepository(PhotoUpload);

/**
 * Get photo gallery feed (Instagram-style)
 * GET /api/photos/feed
 */
export const getPhotoFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Query photos with reading and user data
    const [photos, total] = await photoRepository.findAndCount({
      relations: ['reading', 'reading.user'],
      where: {
        processing_status: ProcessingStatus.COMPLETED,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip,
    });

    // Format response
    const formattedPhotos = photos.map(photo => ({
      id: photo.id,
      photoUrl: photo.file_url,
      fileSize: photo.file_size,
      fileFormat: photo.file_format,
      cameraModel: photo.camera_model,
      isoValue: photo.iso_value,
      exposureTime: photo.exposure_time,
      aperture: photo.aperture,
      createdAt: photo.created_at,
      // Attribution fields
      sourceName: photo.source_name,
      sourceUrl: photo.source_url,
      photographerName: photo.photographer_name,
      licenseType: photo.license_type,
      attributionText: photo.attribution_text,
      reading: {
        id: photo.reading.id,
        locationName: photo.reading.location_name,
        city: photo.reading.city,
        country: photo.reading.country,
        latitude: photo.reading.latitude,
        longitude: photo.reading.longitude,
        sqmValue: photo.reading.sqm_value,
        bortleScale: photo.reading.bortle_scale,
        lightPollutionLevel: photo.reading.light_pollution_level,
        starCount: photo.reading.star_count,
        observationDatetime: photo.reading.observation_datetime,
      },
      user: photo.reading.user ? {
        id: photo.reading.user.id,
        username: photo.reading.user.username,
        fullName: photo.reading.user.full_name,
        state: photo.reading.user.state,
        country: photo.reading.user.country,
      } : null,
    }));

    res.json({
      photos: formattedPhotos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching photo feed:', error);
    res.status(500).json({ error: 'Failed to fetch photo feed' });
  }
};

/**
 * Get single photo details
 * GET /api/photos/:photoId
 */
export const getPhotoDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { photoId } = req.params;

    const photo = await photoRepository.findOne({
      where: { id: photoId },
      relations: ['reading', 'reading.user'],
    });

    if (!photo) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    res.json({
      photo: {
        id: photo.id,
        photoUrl: photo.file_url,
        fileSize: photo.file_size,
        fileFormat: photo.file_format,
        cameraModel: photo.camera_model,
        isoValue: photo.iso_value,
        exposureTime: photo.exposure_time,
        aperture: photo.aperture,
        averageBrightness: photo.average_brightness,
        skyRegionBrightness: photo.sky_region_brightness,
        horizonGlowDetected: photo.horizon_glow_detected,
        colorTemperature: photo.color_temperature,
        processingStatus: photo.processing_status,
        createdAt: photo.created_at,
        // Attribution fields
        sourceName: photo.source_name,
        sourceUrl: photo.source_url,
        photographerName: photo.photographer_name,
        licenseType: photo.license_type,
        attributionText: photo.attribution_text,
        reading: {
          id: photo.reading.id,
          locationName: photo.reading.location_name,
          city: photo.reading.city,
          country: photo.reading.country,
          latitude: photo.reading.latitude,
          longitude: photo.reading.longitude,
          sqmValue: photo.reading.sqm_value,
          bortleScale: photo.reading.bortle_scale,
          nelm: photo.reading.nelm,
          lightPollutionLevel: photo.reading.light_pollution_level,
          starCount: photo.reading.star_count,
          skyBrightness: photo.reading.sky_brightness,
          observationDatetime: photo.reading.observation_datetime,
          weatherConditions: photo.reading.weather_conditions,
          moonPhase: photo.reading.moon_phase,
        },
        user: photo.reading.user ? {
          id: photo.reading.user.id,
          username: photo.reading.user.username,
          fullName: photo.reading.user.full_name,
          state: photo.reading.user.state,
          country: photo.reading.user.country,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('Error fetching photo details:', error);
    res.status(500).json({ error: 'Failed to fetch photo details' });
  }
};
