import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Save {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @Column({ default: false })
  @Field(() => Boolean)
  isSaved: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  isLiked: boolean;
}
