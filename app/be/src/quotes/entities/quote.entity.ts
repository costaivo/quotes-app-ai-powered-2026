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
    nullable: false,
  })
  text!: string;

  @Index()
  @Column('varchar', {
    length: 200,
    nullable: false,
  })
  author!: string;

  @Column('integer', {
    default: 0,
    nullable: false,
  })
  likes!: number;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  tags!: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
