import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Field(() => String)
  image: string;

  @Column()
  @Field(() => String)
  video: string;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
