import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { LikeCommunityBoard } from './entities/likeCommunity.entity';
import { LikeCommunityBoardService } from './likeCommunity.service';

@Resolver()
export class LikeCommunityResolver {
  constructor(
    private readonly likeCommunityBoardService: LikeCommunityBoardService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [LikeCommunityBoard])
  async fetchLikedCommunityBoard(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('userId', { nullable: true }) userId: string, //
  ) {
    return await this.likeCommunityBoardService.findAll({
      currentUser,
      userId,
    });
  }

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
