import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CommunityBoardService } from './communityBoard.service';
import { CreateCommunityBoardInput } from './dto/createCommunityBoard.input';
import { UpdateCommunityBoardInput } from './dto/updateCommunityBoard.input';
import { CommunityBoard } from './entities/communityBoard.entity';

@Resolver()
export class CommunityBoardResolver {
  constructor(private readonly communityBoardService: CommunityBoardService) {}

  @Query(() => [CommunityBoard])
  fetchCommunityBoards(
    @Args('pageSize', { nullable: true }) pageSize: number,
    @Args('page', { nullable: true }) page: number,
    @Args('userId', { nullable: true }) userId: string,
  ) {
    return this.communityBoardService.findAll({ pageSize, page, userId });
  }

  // @Query(() => [CommunityBoard])
  // fetchCommunityBoardbyUser(@Args('userId') userId: string) {
  //   return this.communityBoardService.findAllId({ userId });
  // }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CommunityBoard])
  fetchMyCommunityBoards(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.communityBoardService.findMyCommunity({ currentUser });
  }

  @Query(() => CommunityBoard)
  fetchCommunityBoard(@Args('communityBoardId') communityBoardId: string) {
    return this.communityBoardService.findOne({ communityBoardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CommunityBoard)
  createCommunityBoard(
    @Args('createCommunityBoardInput')
    createCommunityBoardInput: CreateCommunityBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.communityBoardService.create({
      createCommunityBoardInput,
      currentUser,
    });
  }

  @Mutation(() => CommunityBoard)
  async updateCommunityBoard(
    @Args('communityBoardId') communityBoardId: string,
    @Args('updateCommunityBoardInput')
    updateCommunityBoardInput: UpdateCommunityBoardInput,
  ) {
    return await this.communityBoardService.update({
      communityBoardId,
      updateCommunityBoardInput,
    });
  }

  @Mutation(() => Boolean)
  async deleteCommunityBoard(
    @Args('communityBoardId') communityBoardId: string,
  ) {
    return await this.communityBoardService.delete({ communityBoardId });
  }
}
