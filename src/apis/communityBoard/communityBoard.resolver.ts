import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CommunityBoardService } from './communityBoard.service';
import { CreateCommunityBoardInput } from './dto/communityBoard.input';
import { CommunityBoard } from './entities/communityBoard.entity';

@Resolver()
export class CommunityBoardResolver {
  constructor(private readonly communityBoardService: CommunityBoardService) {}

  @Query(() => [CommunityBoard])
  fetchCommunityBoards() {
    return this.communityBoardService.findAll();
  }

  @Mutation(() => CommunityBoard)
  createCommunityBoard(
    @Args('createCommunityBoardInput')
    createCommunityBoardInput: CreateCommunityBoardInput,
  ) {
    return this.communityBoardService.create({
      createCommunityBoardInput,
    });
  }
}
