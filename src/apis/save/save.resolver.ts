import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Save } from './entities/save.entity';
import { SaveService } from './save.service';

@Resolver()
export class SaveResolver {
  constructor(private readonly saveService: SaveService) {}

  @Query(() => [Save])
  fetchSavedBoards(@Args('userId') userId: string) {
    return this.saveService.fetch({ userId });
  }

  //이부분을 고치자
  @Mutation(() => String)
  saveBoard(
    @Args('boardId') boardId: string, //
    @Args('userId') userId: string,
  ) {
    return this.saveService.save({ boardId, userId });
  }
}
