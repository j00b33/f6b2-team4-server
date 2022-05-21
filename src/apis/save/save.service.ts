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

  async save({ boardId, currentUser }) {
    const savedBoard = await this.saveRepository.findOne({
      where: { board: boardId, user: currentUser },
    });

    if (savedBoard && savedBoard.isSaved === true) {
      await this.saveRepository.save({
        ...savedBoard,
        isSaved: false,
      });

      return 'Board Save Canceled';
    } else if (savedBoard && savedBoard.isSaved === false) {
      await this.saveRepository.save({
        ...savedBoard,
        isSaved: true,
      });

      return 'Board Saved';
    }

    await this.saveRepository.save({
      user: currentUser,
      board: boardId,
      isSaved: true,
    });

    return 'Board Saved';
  }

  async like({ boardId, currentUser }) {
    const Board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    const likedBoard = await this.saveRepository.findOne({
      where: { board: boardId, user: currentUser },
    });

    if (likedBoard && likedBoard.isLiked === true) {
      await this.saveRepository.save({
        ...likedBoard,
        isLiked: false,
      });
      await this.boardRepository.save({
        where: {
          writer: {
            id: Board.id,
          },
        },
        ...Board,
        likes: Board.likes - 1,
      });

      return 'Board Like Canceled';
    } else if (likedBoard && likedBoard.isLiked === false) {
      await this.saveRepository.save({
        ...likedBoard,
        isLiked: true,
      });
      await this.boardRepository.save({
        where: {
          writer: {
            id: Board.id,
          },
        },
        ...Board,
        likes: Board.likes + 1,
      });
      return 'Board Liked';
    }

    await this.saveRepository.save({
      user: currentUser,
      board: boardId,
      isLiked: true,
    });
    await this.boardRepository.save({
      where: {
        writer: {
          id: Board.id,
        },
      },
      ...Board,
      likes: Board.likes + 1,
    });
    return 'Board Liked';
  }
}
