import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('impact_metrics')
export class ImpactMetric {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 100, unique: true })
  metric_name: string;

  @Column('int', { default: 0 })
  metric_value: number;

  @Column('varchar', { length: 255, nullable: true })
  description?: string;

  @Column('varchar', { length: 255, nullable: true })
  updated_by?: string;

  @UpdateDateColumn()
  last_updated: Date;
}
