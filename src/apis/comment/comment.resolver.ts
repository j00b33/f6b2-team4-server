import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/createComment.input';
import { UpdateCommentInput } from './dto/updateComment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment])
  fetchComments(@Args('boardId') boardId: string) {
    return this.commentService.findAll({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.commentService.create({
      createCommentInput,
      boardId,
      currentUser,
    });
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Args('commentId') commentId: string,
  ) {
    return this.commentService.update({
      updateCommentInput,
      commentId,
    });
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args('commentId') commentId: string) {
    return await this.commentService.delete({ commentId });
  }
}
