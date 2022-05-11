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
export class CommunityBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  date: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  likes: number;

  @Column()
  @Field(() => String)
  image: string;

  //   @ManyToOne(() => User)
  //   @Field(() => User)
  //   user: User;
}
