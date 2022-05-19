import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CommunityBoard } from './entities/communityBoard.entity';

@Injectable()
export class CommunityBoardService {
  constructor(
    @InjectRepository(CommunityBoard)
    private readonly communityBoardRepository: Repository<CommunityBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.communityBoardRepository
      .createQueryBuilder('communityboard')
      .leftJoinAndSelect('communityboard.writer', 'user')
      .orderBy('communityboard.createdat', 'DESC')
      .getMany();
  }

  async findOne({ communityBoardId }) {
    return this.communityBoardRepository.findOne({
      where: { id: communityBoardId },
      relations: ['writer'],
    });
  }

  async create({ createCommunityBoardInput, currentUser }) {
    const writer = await this.userRepository.findOne({
      email: currentUser.email,
    });
    return await this.communityBoardRepository.save({
      ...createCommunityBoardInput,
      writer: writer,
    });
  }

  async update({ communityBoardId, updateCommunityBoardInput }) {
    const oldBoard = await this.communityBoardRepository.findOne({
      where: { id: communityBoardId },
    });
    const newBoard = { ...oldBoard, ...updateCommunityBoardInput };

    return await this.communityBoardRepository.save(newBoard);
  }

  async delete({ communityBoardId }) {
    const result = await this.communityBoardRepository.softDelete({
      id: communityBoardId,
    });
    return result.affected ? true : false;
  }
}
