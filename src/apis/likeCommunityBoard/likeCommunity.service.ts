import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityBoard } from '../communityBoard/entities/communityBoard.entity';
import { User } from '../user/entities/user.entity';
import { LikeCommunityBoard } from './entities/likeCommunity.entity';

@Injectable()
export class LikeCommunityBoardService {
  constructor(
    @InjectRepository(CommunityBoard)
    private readonly communityBoardRepository: Repository<CommunityBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(LikeCommunityBoard)
    private readonly likeCommunityBoardRepository: Repository<LikeCommunityBoard>,
  ) {}

  async like({ communityBoardId, currentUser }) {
    const likedCommunity = await this.likeCommunityBoardRepository.findOne({
      where: { communityBoard: communityBoardId, user: currentUser },
    });

    if (likedCommunity && likedCommunity.isLiked === true) {
      await this.likeCommunityBoardRepository.save({
        ...likedCommunity,
        isLiked: false,
      });
      return 'Community Board Like Canceled';
    } else if (likedCommunity && likedCommunity.isLiked === false) {
      await this.likeCommunityBoardRepository.save({
        ...likedCommunity,
        isLiked: true,
      });
      return 'Community Board Liked';
    }

    await this.likeCommunityBoardRepository.save({
      user: currentUser,
      communityBoard: communityBoardId,
      isLiked: true,
    });
    return 'Community Board Liked';
  }
}
