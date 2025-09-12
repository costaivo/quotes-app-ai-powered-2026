import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';

@Entity('quotes')
@Check('like_count_non_negative', 'like_count >= 0')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  quote: string;

  @Column({ type: 'varchar', length: 200 })
  author: string;

  @Column({ type: 'integer', default: 0 })
  like_count: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tags: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
