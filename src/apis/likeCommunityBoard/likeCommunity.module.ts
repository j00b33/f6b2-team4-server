import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityBoard } from '../communityBoard/entities/communityBoard.entity';
import { User } from '../user/entities/user.entity';
import { LikeCommunityBoard } from './entities/likeCommunity.entity';
import { LikeCommunityResolver } from './likeCommunity.resolver';
import { LikeCommunityBoardService } from './likeCommunity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityBoard, User, LikeCommunityBoard]),
  ],
  providers: [LikeCommunityResolver, LikeCommunityBoardService],
})
export class LikeCommunityBoardModule {}
