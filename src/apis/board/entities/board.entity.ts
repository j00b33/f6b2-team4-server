import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => String)
  video: string;

  @CreateDateColumn()
  @Field(() => Date)
  date: Date;

  @Column()
  @Field(() => Int)
  likes: number;

  // @ManyToOne(() => User)
  // @Field(() => User)
  // user: User;
}
