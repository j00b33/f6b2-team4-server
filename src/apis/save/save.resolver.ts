import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Save } from './entities/save.entity';
import { SaveService } from './save.service';

@Resolver()
export class SaveResolver {
  constructor(private readonly saveService: SaveService) {}

  @Query(() => [Save])
  fetchSavedBoards(@Args('userId') userId: string) {
    return this.saveService.fetch({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  saveBoard(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.saveService.save({ boardId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  likeBoard(
    @Args('boardId') boardId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.saveService.like({ boardId, currentUser });
  }
}
