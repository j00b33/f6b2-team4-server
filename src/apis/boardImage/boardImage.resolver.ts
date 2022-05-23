import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

import { BoardImageService } from './boardImage.service';
import { BoardImage } from './entities/boardImage.entity';

@Resolver()
export class BoardImageResolver {
  constructor(private readonly boardImageService: BoardImageService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BoardImage])
  fetchBoardImages() {
    return this.boardImageService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [BoardImage])
  fetchBoardImage(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardImageService.find({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [BoardImage])
  createBoardImage(
    @Args({ name: 'image', type: () => [String] }) image: string[],
    @Args('board') board: string,
  ) {
    return this.boardImageService.create({ image, board });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [BoardImage])
  updateBoardImage(
    @Args({ name: 'image', type: () => [String] }) image: string[], //
    @Args('board') board: string,
  ) {
    return this.boardImageService.update({ image, board });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoardImage(
    @Args('image') image: string, //
  ) {
    return this.boardImageService.delete({ image });
  }
}
