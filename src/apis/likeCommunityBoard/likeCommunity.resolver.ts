import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { LikeCommunityBoardService } from './likeCommunity.service';

@Resolver()
export class LikeCommunityResolver {
  constructor(
    private readonly likeCommunityBoardService: LikeCommunityBoardService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  likeCommunityBoard(
    @Args('communityBoardId') communityBoardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.likeCommunityBoardService.like({
      communityBoardId,
      currentUser,
    });
  }
}
