import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  fetchBoards(
    @Args('pageSize', { nullable: true }) pageSize: number,
    @Args('page', { nullable: true }) page: number,
    @Args('userId', { nullable: true }) userId: string,
    @Args('bestboardCount', { nullable: true }) bestboardCount: number,
    @Args('language', { nullable: true }) language: string,
  ) {
    return this.boardService.findAll({
      pageSize,
      page,
      userId,
      bestboardCount,
      language,
    });
  }

  // @Query(() => [Board])
  // fetchBoardsbyUser(@Args('userId', { nullable: true }) userId: string) {
  //   return this.boardService.findAllId({ userId });
  // }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  fetchMyBoards(@CurrentUser() currentUser: ICurrentUser) {
    return this.boardService.findMyBoards({ currentUser });
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @Query(() => Int)
  fetchBoardsCount(@Args('UserId', { nullable: true }) userId: string) {
    return this.boardService.count({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.boardService.create({ createBoardInput, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({ boardId, updateBoardInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteBoard(@Args('boardId') boardId: string) {
    return await this.boardService.delete({ boardId });
  }
}
