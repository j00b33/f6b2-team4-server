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
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.writer', 'user')
      .orderBy('board.createdat', 'DESC')
      .getMany();
  }

  async findAllId({ userId }) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .where('board.writer.id = :id', { id: userId })
      .leftJoinAndSelect('board.writer', 'user')
      .orderBy('board.createdat', 'DESC')
      .getMany();
  }

  async findMyBoards({ currentUser }) {
    return await this.boardRepository.find({
      where: { writer: currentUser },
    });
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
