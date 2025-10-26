import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { SkyReading } from './SkyReading';
import { SqmDevice } from './SqmDevice';
import { Contribution } from './Contribution';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  password_hash: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @OneToMany(() => SkyReading, (reading) => reading.user)
  sky_readings: SkyReading[];

  @OneToMany(() => SqmDevice, (device) => device.owner)
  sqm_devices: SqmDevice[];

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions: Contribution[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  // Helper method to hash password
  async hashPassword(password: string): Promise<void> {
    this.password_hash = await bcrypt.hash(password, 10);
  }

  // Helper method to verify password
  async verifyPassword(password: string): Promise<boolean> {
    if (!this.password_hash) {
      return false;
    }
    return bcrypt.compare(password, this.password_hash);
  }
}
