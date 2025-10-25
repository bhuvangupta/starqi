import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User';

@Entity('sqm_devices')
export class SqmDevice {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  device_serial: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  device_model: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  owner_user_id: string | null;

  // Installation location (if fixed)
  @Column({ type: 'boolean', default: false })
  is_fixed_location: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  fixed_latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  fixed_longitude: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fixed_location_name: string | null;

  @Column({ type: 'timestamp', nullable: true })
  last_reading_at: Date | null;

  @Column({ type: 'date', nullable: true })
  calibration_date: Date | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sqm_devices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
