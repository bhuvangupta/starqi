import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

export enum ArticleCategory {
  BASICS = 'basics',
  SCIENCE = 'science',
  HOW_TO = 'how-to',
  IMPACT = 'impact',
  ACTION = 'action',
  NEWS = 'news',
}

export enum ArticleLanguage {
  EN = 'en',
  HI = 'hi',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('articles')
@Index('idx_status_published', ['status', 'published_at']) // Published articles sorted by date
@Index('idx_category_status', ['category', 'status']) // Category filtering
@Index('idx_language_status', ['language', 'status']) // Language filtering
@Index('idx_created_at', ['created_at']) // Recent articles
export class Article {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 255, unique: true })
  slug: string;

  @Column('text', { nullable: true })
  excerpt?: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleCategory,
    default: ArticleCategory.BASICS,
  })
  category: ArticleCategory;

  @Column({
    type: 'enum',
    enum: ArticleLanguage,
    default: ArticleLanguage.EN,
  })
  language: ArticleLanguage;

  @Column('varchar', { length: 36, nullable: true })
  author_id?: string;

  @Column('varchar', { length: 255, default: 'StarQI Team' })
  author_name: string;

  @Column('varchar', { length: 500, nullable: true })
  featured_image?: string;

  @Column('varchar', { length: 500, nullable: true })
  tags?: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Column('int', { default: 0 })
  view_count: number;

  @Column('timestamp', { nullable: true })
  published_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author?: User;
}
