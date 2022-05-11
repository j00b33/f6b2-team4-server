import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityBoardResolver } from './communityBoard.resolver';
import { CommunityBoardService } from './communityBoard.service';
import { CommunityBoard } from './entities/communityBoard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityBoard])],
  providers: [CommunityBoardResolver, CommunityBoardService],
})
export class CommunityBoardModule {}
