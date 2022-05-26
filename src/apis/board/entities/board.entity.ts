import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { User } from 'src/apis/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ default: 'null' })
  @Field(() => String)
  video: string;

  @Column({ default: 0 })
  @Field(() => Int)
  likes: number;

  @Column({ default: 0 })
  @Field(() => Int)
  commentsCount: number;

  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: 'alive' })
  @Field(() => String)
  elasticdelete: string;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(
    (type) => Comment,
    (comment) => comment.board, //
    { cascade: true },
  )
  public comment: Comment[];
}
