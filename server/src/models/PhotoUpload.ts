import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SkyReading } from './SkyReading';

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('photo_uploads')
@Index('idx_created_at', ['created_at']) // Recent photos sorting
@Index('idx_processing_status', ['processing_status']) // Filter by processing status
@Index('idx_source_name', ['source_name']) // Filter by source (user vs crawled)
export class PhotoUpload {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36, unique: true })
  reading_id: string;

  // File information
  @Column({ type: 'varchar', length: 512 })
  file_url: string;

  @Column({ type: 'int', nullable: true })
  file_size: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  file_format: string | null;

  // Camera metadata (EXIF)
  @Column({ type: 'varchar', length: 100, nullable: true })
  camera_model: string | null;

  @Column({ type: 'int', nullable: true })
  iso_value: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  exposure_time: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  aperture: string | null;

  // Image analysis metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  average_brightness: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sky_region_brightness: number | null;

  @Column({ type: 'boolean', nullable: true })
  horizon_glow_detected: boolean | null;

  @Column({ type: 'int', nullable: true })
  color_temperature: number | null;

  @Column({
    type: 'enum',
    enum: ProcessingStatus,
    default: ProcessingStatus.PENDING,
  })
  processing_status: ProcessingStatus;

  @Column({ type: 'text', nullable: true })
  processing_error: string | null;

  // Photo attribution (for crawled photos)
  @Column({ type: 'varchar', length: 100, nullable: true })
  source_name: string | null; // e.g., "NASA APOD", "Unsplash", "User Upload"

  @Column({ type: 'varchar', length: 512, nullable: true })
  source_url: string | null; // Original photo URL

  @Column({ type: 'varchar', length: 255, nullable: true })
  photographer_name: string | null; // Photographer name if different from user

  @Column({ type: 'varchar', length: 100, nullable: true })
  license_type: string | null; // e.g., "Public Domain", "CC BY 4.0"

  @Column({ type: 'text', nullable: true })
  attribution_text: string | null; // Full attribution text

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Relations
  @OneToOne(() => SkyReading, (reading) => reading.photo_upload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reading_id' })
  reading: SkyReading;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
