import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Save } from './entities/save.entity';

@Injectable()
export class SaveService {
  constructor(
    @InjectRepository(Save)
    private readonly saveRepository: Repository<Save>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async fetch({ userId }) {
    return this.saveRepository.find({
      where: { user: userId },
      relations: ['user', 'board'],
    });
  }

  async save({ boardId, userId }) {
    const boardID = await this.boardRepository.findOne({
      id: boardId,
    });

    const userID = await this.userRepository.findOne({
      id: userId,
    });

    const existingUser = await this.saveRepository.findOne({
      user: userId,
    });

    const existingBoard = await this.saveRepository.findOne({
      board: boardId,
    });

    if (existingUser) {
      if (existingBoard) {
        await this.saveRepository.delete({
          board: boardID,
        });
        return '게시물 저장이 취소되었습니다';
      }
    }

    await this.saveRepository.save({
      user: userID,
      board: boardID,
    });
    return '게시물이 저장되었습니다';
  }
}
