import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likes: number;

  @Column({ default: 'empty' })
  @Field(() => String)
  image: string;

  @Column({ default: 'empty' })
  @Field(() => String)
  video: string;

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @ManyToOne(
    (type) => Board, //
    (board) => board.comment,
  )
  @Field(() => Board)
  public board!: Board;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Comment)
  @Field(() => Comment)
  parentComment: Comment;
}
