import { Repository } from 'typeorm';
import sharp from 'sharp';
import { SkyReading, ReadingType } from '../models/SkyReading';
import { PhotoUpload, ProcessingStatus } from '../models/PhotoUpload';
import { SkyQualityAnalyzer } from './SkyQualityAnalyzer';
import { AppDataSource } from '../config/database';
import { getFileUrl } from '../utils/fileUpload';

export interface PhotoProcessingInput {
  filePath: string;
  fileName: string;
  fileSize: number;
  userId?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  city?: string;
  country?: string;
  observationDatetime?: Date;
}

export class PhotoProcessingService {
  private skyAnalyzer: SkyQualityAnalyzer;
  private readingRepository: Repository<SkyReading>;
  private photoRepository: Repository<PhotoUpload>;

  constructor() {
    this.skyAnalyzer = new SkyQualityAnalyzer();
    this.readingRepository = AppDataSource.getRepository(SkyReading);
    this.photoRepository = AppDataSource.getRepository(PhotoUpload);
  }

  /**
   * Process uploaded photo and create sky reading
   */
  async processPhoto(input: PhotoProcessingInput): Promise<SkyReading> {
    let photoUpload: PhotoUpload | null = null;

    try {
      // Extract EXIF metadata
      const exifData = await this.extractExifData(input.filePath);

      // Create photo upload record
      photoUpload = this.photoRepository.create({
        file_url: getFileUrl(input.fileName),
        file_size: input.fileSize,
        file_format: input.fileName.split('.').pop(),
        camera_model: exifData.model,
        iso_value: exifData.iso,
        exposure_time: exifData.exposureTime,
        aperture: exifData.aperture,
        processing_status: ProcessingStatus.PROCESSING,
      });

      // Analyze the photo
      const analysisResult = await this.skyAnalyzer.analyzePhoto(input.filePath);

      // Update photo upload with analysis results
      photoUpload.average_brightness = analysisResult.average_brightness;
      photoUpload.sky_region_brightness = analysisResult.sky_region_brightness;
      photoUpload.horizon_glow_detected = analysisResult.horizon_glow_detected;
      photoUpload.color_temperature = analysisResult.color_temperature;
      photoUpload.processing_status = ProcessingStatus.COMPLETED;

      // Create sky reading
      const skyReading = this.readingRepository.create({
        user_id: input.userId || null,
        reading_type: ReadingType.PHOTO,
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName || null,
        city: input.city || null,
        country: input.country || null,
        sqm_value: analysisResult.sqm_value,
        bortle_scale: analysisResult.bortle_scale,
        nelm: this.calculateNELM(analysisResult.sqm_value),
        sky_brightness: analysisResult.sky_brightness,
        star_count: analysisResult.star_count,
        light_pollution_level: analysisResult.light_pollution_level,
        observation_datetime: input.observationDatetime || new Date(),
      });

      // Save both entities
      const savedReading = await this.readingRepository.save(skyReading);

      photoUpload.reading_id = savedReading.id;
      await this.photoRepository.save(photoUpload);

      return savedReading;
    } catch (error) {
      // Mark photo as failed if it exists
      if (photoUpload) {
        photoUpload.processing_status = ProcessingStatus.FAILED;
        photoUpload.processing_error =
          error instanceof Error ? error.message : 'Unknown error';
        await this.photoRepository.save(photoUpload);
      }

      console.error('Error processing photo:', error);
      throw error;
    }
  }

  /**
   * Extract EXIF metadata from image
   */
  private async extractExifData(
    filePath: string
  ): Promise<{
    model: string | null;
    iso: number | null;
    exposureTime: string | null;
    aperture: string | null;
  }> {
    try {
      const metadata = await sharp(filePath).metadata();
      const exif = metadata.exif;

      let model: string | null = null;
      let iso: number | null = null;
      let exposureTime: string | null = null;
      let aperture: string | null = null;

      // Parse EXIF data if available
      if (exif) {
        // Note: Parsing EXIF requires additional library or manual parsing
        // For now, returning defaults. In production, use 'exif-parser' or similar
        // This is a placeholder for actual EXIF extraction
      }

      return { model, iso, exposureTime, aperture };
    } catch (error) {
      console.error('Error extracting EXIF data:', error);
      return { model: null, iso: null, exposureTime: null, aperture: null };
    }
  }

  /**
   * Calculate Naked Eye Limiting Magnitude (NELM) from SQM value
   */
  private calculateNELM(sqm: number): number {
    // Empirical relationship between SQM and NELM
    // NELM ≈ 7.93 - 5 * log10(10^(4.316 - (SQM/5)) + 1)
    // Simplified approximation:
    const nelm = sqm / 5 + 2;
    return Math.max(1, Math.min(8, Math.round(nelm * 10) / 10));
  }

  /**
   * Get reading by ID with photo upload
   */
  async getReadingWithPhoto(readingId: string): Promise<SkyReading | null> {
    return this.readingRepository.findOne({
      where: { id: readingId },
      relations: ['photo_upload', 'user'],
    });
  }

  /**
   * Get all readings with optional filters
   */
  async getReadings(filters: {
    userId?: string;
    country?: string;
    minBortle?: number;
    maxBortle?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ readings: SkyReading[]; total: number }> {
    const query = this.readingRepository
      .createQueryBuilder('reading')
      .leftJoinAndSelect('reading.photo_upload', 'photo')
      .leftJoinAndSelect('reading.user', 'user');

    if (filters.userId) {
      query.andWhere('reading.user_id = :userId', { userId: filters.userId });
    }

    if (filters.country) {
      query.andWhere('reading.country = :country', {
        country: filters.country,
      });
    }

    if (filters.minBortle !== undefined) {
      query.andWhere('reading.bortle_scale >= :minBortle', {
        minBortle: filters.minBortle,
      });
    }

    if (filters.maxBortle !== undefined) {
      query.andWhere('reading.bortle_scale <= :maxBortle', {
        maxBortle: filters.maxBortle,
      });
    }

    query.orderBy('reading.observation_datetime', 'DESC');

    const total = await query.getCount();

    if (filters.limit) {
      query.limit(filters.limit);
    }

    if (filters.offset) {
      query.offset(filters.offset);
    }

    const readings = await query.getMany();

    return { readings, total };
  }
}
