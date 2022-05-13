import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({ boardId }) {
    return await this.commentRepository.find({
      where: { board: boardId },
      relations: ['board', 'writer', 'parentComment'],
    });
  }

  async create({ createCommentInput, boardId, currentUser }) {
    const writer = await this.userRepository.findOne({
      email: currentUser.email,
    });

    return this.commentRepository.save({
      ...createCommentInput,
      writer: writer,
      board: boardId,
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
    const result = await this.commentRepository.softDelete({ id: commentId });
    return result.affected ? true : false;
  }
}
