import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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
  fetchBoards(@Args('userId') userId: string) {
    return this.boardService.findAll({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  fetchMyBoards(@CurrentUser() currentUser: ICurrentUser) {
    return this.boardService.findMyBoards({ currentUser });
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.boardService.create({ createBoardInput, currentUser });
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({ boardId, updateBoardInput });
  }

  @Mutation(() => Boolean)
  async deleteBoard(@Args('boardId') boardId: string) {
    return await this.boardService.delete({ boardId });
  }
}
