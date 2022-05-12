import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.boardRepository.find({ relations: ['writer'] });
  }

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['writer'],
    });
  }

  async create({ createBoardInput, currentUser }) {
    const writer = await this.userRepository.findOne({
      email: currentUser.email,
    });

    return await this.boardRepository.save({
      ...createBoardInput,
      writer: writer,
    });
  }

  async update({ boardId, updateBoardInput }) {
    const oldBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    const newBoard = { ...oldBoard, ...updateBoardInput };

    return await this.boardRepository.save(newBoard);
  }

  async delete({ boardId }) {
    const result = await this.boardRepository.softDelete({ id: boardId });
    return result.affected ? true : false;
  }
}
