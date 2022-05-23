import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BoardImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: 'null' })
  @Field(() => String)
  image: string;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
