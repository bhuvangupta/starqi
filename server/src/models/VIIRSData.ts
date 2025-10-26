import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * VIIRS (Visible Infrared Imaging Radiometer Suite) Data Model
 * Stores nighttime lights data from NOAA/NASA satellites for light pollution analysis
 */
@Entity('viirs_data')
@Index(['latitude', 'longitude'])
@Index(['data_year'])
export class VIIRSData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Geographic coordinates (grid center point)
  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  // Radiance value in nanoWatts/cm²/sr
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  radiance: number;

  // Data source year (e.g., 2023)
  @Column({ type: 'int' })
  data_year: number;

  // Tile identifier (e.g., "75N180W", "00N180W")
  @Column({ type: 'varchar', length: 20, nullable: true })
  tile_id: string | null;

  // Data source (e.g., "VIIRS-DNB-Annual", "VIIRS-DNB-Monthly")
  @Column({ type: 'varchar', length: 50, default: 'VIIRS-DNB-Annual' })
  source: string;

  // Grid resolution in arc-seconds (e.g., 15)
  @Column({ type: 'int', default: 15 })
  resolution_arcsec: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
