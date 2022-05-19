import { Field, ObjectType } from '@nestjs/graphql';
import { CommunityBoard } from 'src/apis/communityBoard/entities/communityBoard.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class LikeCommunityBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isLiked: boolean;

  @ManyToOne(() => CommunityBoard)
  @Field(() => CommunityBoard)
  communityBoard: CommunityBoard;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
