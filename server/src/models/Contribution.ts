import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User';

export enum ContributionType {
  READING = 'reading',
  PHOTO = 'photo',
  DEVICE_INSTALL = 'device_install',
  VERIFICATION = 'verification',
}

@Entity('contributions')
export class Contribution {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  user_id: string;

  @Column({
    type: 'enum',
    enum: ContributionType,
  })
  contribution_type: ContributionType;

  @Column({ type: 'int', default: 0 })
  points: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.contributions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
