import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { CommunityBoardResolver } from './communityBoard.resolver';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityBoard } from './entities/communityBoard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityBoard, User, Board])],
  providers: [CommunityBoardResolver, CommunityBoardService],
})
export class CommunityBoardModule {}
