import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { LikeCommentService } from './likeComment.service';

@Resolver()
export class LikeCommentResolver {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  likeComment(
    @Args('commentId') commentId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.likeCommentService.like({
      commentId,
      currentUser,
    });
  }
}
