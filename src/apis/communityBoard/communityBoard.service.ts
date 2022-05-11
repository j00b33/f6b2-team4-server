import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityBoard } from './entities/communityBoard.entity';

@Injectable()
export class CommunityBoardService {
  constructor(
    @InjectRepository(CommunityBoard)
    private readonly communityBoardRepository: Repository<CommunityBoard>,
  ) {}

  async findAll() {
    return this.communityBoardRepository.find();
  }

  async create({ createCommunityBoardInput }) {
    return await this.communityBoardRepository.save({
      ...createCommunityBoardInput,
    });
  }
}
