import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { LikeComment } from './entities/likeComment.entity';

@Injectable()
export class LikeCommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(LikeComment)
    private readonly likeCommentRepository: Repository<LikeComment>,
  ) {}

  async find({ currentUser, userId }) {
    if (userId) {
      return await this.likeCommentRepository.find({
        where: { user: currentUser.id },
        relations: ['user', 'comment'],
      });
    }

    return await this.likeCommentRepository.find({
      where: { user: currentUser.id },
      relations: ['user', 'comment'],
    });
  }

  async like({ commentId, currentUser }) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    const likedComment = await this.likeCommentRepository.findOne({
      where: {
        comment: commentId,
        user: currentUser,
      },
    });

    if (likedComment && likedComment.isLiked === true) {
      await this.likeCommentRepository.save({
        ...likedComment,
        isLiked: false,
      });
      await this.commentRepository.save({
        where: {
          writer: {
            id: comment.id,
          },
        },
        ...comment,
        likes: comment.likes - 1,
      });
      return 'Comment Like Canceled';
    } else if (likedComment && likedComment.isLiked === false) {
      await this.likeCommentRepository.save({
        ...likedComment,
        isLiked: true,
      });
      await this.commentRepository.save({
        where: {
          writer: {
            id: comment.id,
          },
        },
        ...comment,
        likes: comment.likes + 1,
      });
      return 'Comment Liked';
    }

    await this.likeCommentRepository.save({
      user: currentUser,
      comment: commentId,
      isLiked: true,
    });
    await this.commentRepository.save({
      where: {
        writer: {
          id: comment.id,
        },
      },
      ...comment,
      likes: comment.likes + 1,
    });
    return 'Comment Liked';
  }
}
