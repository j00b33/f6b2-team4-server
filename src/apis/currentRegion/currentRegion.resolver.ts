import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentRegionService } from './currentRegion.service';
import { CurrentRegionInput } from './dto/createCurrentRegion.input';
import { CurrentRegion } from './entities/currentRegion.entity';

@Resolver()
export class CurrentRegionResolver {
  constructor(private readonly currentRegionService: CurrentRegionService) {}

  @Mutation(() => CurrentRegion)
  createCurrentRegion(
    @Args('currentRegionInput') currentRegionInput: CurrentRegionInput,
    //
  ) {
    return this.currentRegionService.create({ currentRegionInput });
  }

  @Mutation(() => CurrentRegion)
  async updateCurrentRegion(
    @Args('UpdateCurrentRegionInput')
    updateCurrentRegionInput: CurrentRegionInput, //
    @Args('currentRegionId') currentRegionId: string,
  ) {
    return await this.currentRegionService.update({
      updateCurrentRegionInput,
      currentRegionId,
    });
  }

  @Mutation(() => Boolean)
  async deleteCurrentRegion(@Args('currentRegionId') currentRegionId: string) {
    return await this.currentRegionService.delete({ currentRegionId });
  }
}
