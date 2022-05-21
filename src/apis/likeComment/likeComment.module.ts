import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { LikeComment } from './entities/likeComment.entity';
import { LikeCommentResolver } from './likeComment.resolver';
import { LikeCommentService } from './likeComment.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeComment, User, Comment])],
  providers: [LikeCommentResolver, LikeCommentService],
})
export class LikeCommentModule {}
