import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { LikeComment } from './entities/likeComment.entity';
import { LikeCommentService } from './likeComment.service';

@Resolver()
export class LikeCommentResolver {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [LikeComment])
  fetchLikedComment(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('userId', { nullable: true }) userId: string,
  ) {
    return this.likeCommentService.find({ currentUser, userId });
  }

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
