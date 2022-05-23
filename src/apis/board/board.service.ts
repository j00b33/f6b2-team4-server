import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll({ pageSize, page, userId }) {
    if (page <= 0) {
      page = 1;
    }
    if (pageSize && page && userId) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: { writer: { id: userId } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['writer'],
      });
    }

    if (pageSize && page) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['writer'],
      });
    }
    if (userId) {
      return await this.boardRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: { writer: { id: userId } },
        relations: ['writer'],
      });
    }

    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.writer', 'user')
      .orderBy('board.createdat', 'DESC')
      .getMany();
  }

  async count({ userId }) {
    if (userId) {
      const allsaved = await this.boardRepository.count({
        where: {
          writer: userId,
        },
      });
      return allsaved;
    }

    return (await this.boardRepository.find()).length;
  }

  // async findAllId({ userId }) {
  //   return await this.boardRepository
  //     .createQueryBuilder('board')
  //     .where('board.writer.id = :id', { id: userId })
  //     .leftJoinAndSelect('board.writer', 'user')
  //     .orderBy('board.createdat', 'DESC')
  //     .getMany();
  // }

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

    await this.userRepository.update(
      {
        email: currentUser.email,
      },
      {
        boardCounts: writer.boardCounts + 1,
      },
    );

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
    const findUserFromBoard = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['writer'],
    });
    console.log(findUserFromBoard);

    await this.userRepository.update(
      {
        email: findUserFromBoard.writer.email,
      },
      {
        boardCounts: findUserFromBoard.writer.boardCounts - 1,
      },
    );
    const parent = await this.boardRepository.findOneOrFail(
      { id: boardId },
      { relations: ['comment'] },
    );

    const result = await this.boardRepository.softRemove(parent);

    return result ? true : false;
  }
}
