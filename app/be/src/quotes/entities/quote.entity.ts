import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('text', {
    name: 'quote',
    nullable: false,
  })
  quote!: string;

  @Index()
  @Column('varchar', {
    length: 200,
    nullable: false,
  })
  author!: string;

  @Column('integer', {
    name: 'like_count',
    default: 0,
    nullable: false,
  })
  likeCount!: number;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  tags!: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @Column('varchar', {
    name: 'created_by',
    length: 255,
    nullable: true,
  })
  createdBy!: string | null;

  @Column('varchar', {
    name: 'updated_by',
    length: 255,
    nullable: true,
  })
  updatedBy!: string | null;
}
