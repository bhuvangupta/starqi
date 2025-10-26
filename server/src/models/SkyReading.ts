import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User';
import { PhotoUpload } from './PhotoUpload';

export enum ReadingType {
  PHOTO = 'photo',
  SQM_DEVICE = 'sqm_device',
  MANUAL = 'manual',
}

export enum LightPollutionLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  MODERATE = 'moderate',
  POOR = 'poor',
  VERY_POOR = 'very_poor',
}

@Entity('sky_readings')
// Composite indexes for common query patterns
@Index('idx_user_observation', ['user_id', 'observation_datetime']) // User's readings ordered by date
@Index('idx_country_created', ['country', 'created_at']) // Country stats over time
@Index('idx_city_country', ['city', 'country']) // Location-based queries
@Index('idx_observation_datetime', ['observation_datetime']) // Time-based sorting
@Index('idx_created_at', ['created_at']) // Recent readings
@Index('idx_user_sqm', ['user_id', 'sqm_value']) // User's best readings
export class SkyReading {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  @Index('idx_user_id') // Single column index for user queries
  user_id: string | null;

  @Column({
    type: 'enum',
    enum: ReadingType,
  })
  reading_type: ReadingType;

  // Location data
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location_name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('idx_city') // City-based queries and grouping
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('idx_country') // Country-based queries and grouping
  country: string | null;

  // Sky Quality Metrics
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  sqm_value: number | null; // mag/arcsec²

  @Column({ type: 'tinyint', nullable: true })
  bortle_scale: number | null; // 1-9

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  nelm: number | null; // Naked Eye Limiting Magnitude

  // Photo analysis results
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  sky_brightness: number | null;

  @Column({ type: 'int', nullable: true })
  star_count: number | null;

  @Column({
    type: 'enum',
    enum: LightPollutionLevel,
  })
  light_pollution_level: LightPollutionLevel;

  // Metadata
  @Column({ type: 'timestamp' })
  observation_datetime: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  weather_conditions: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  moon_phase: number | null; // 0-1

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sky_readings, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => PhotoUpload, (photo) => photo.reading)
  photo_upload: PhotoUpload;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
