import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll({ pageSize, page, boardId }) {
    if (page <= 0) {
      page = 1;
    }
    if (pageSize && page && boardId) {
      return await this.commentRepository.find({
        where: { board: boardId },
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['board', 'writer', 'parentComment'],
      });
    }

    return await this.commentRepository.find({
      where: { board: boardId },
      order: {
        createdAt: 'DESC',
      },
      relations: ['board', 'writer', 'parentComment'],
    });
  }

  async create({ createCommentInput, boardId, currentUser }) {
    const findboard = await this.boardRepository.findOne({
      id: boardId,
    });
    await this.boardRepository.update(
      {
        id: boardId,
      },
      {
        commentsCount: findboard.commentsCount + 1,
      },
    );

    const writer = await this.userRepository.findOne({
      email: currentUser.email,
    });
    let parentComment;
    if (createCommentInput.parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        id: createCommentInput.parentCommentId,
      });
    }

    return this.commentRepository.save({
      ...createCommentInput,
      writer: writer,
      board: boardId,
      parentComment,
    });
  }

  async update({ updateCommentInput, commentId }) {
    const oldComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    const newComment = { ...oldComment, ...updateCommentInput };

    return await this.commentRepository.save(newComment);
  }

  async delete({ commentId }) {
    const findBoardFromComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['board'],
    });

    await this.boardRepository.update(
      {
        id: findBoardFromComment.board.id,
      },
      {
        commentsCount: findBoardFromComment.board.commentsCount - 1,
      },
    );

    const result = await this.commentRepository.softDelete({
      id: commentId,
    });
    await this.commentRepository.softDelete({
      parentComment: commentId,
    });

    return result.affected ? true : false;
  }
}
