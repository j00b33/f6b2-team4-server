import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Receipt } from './entities/receipt.entity';
import { ReceiptService } from './receipt.service';

@Resolver()
export class ReceiptResolver {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Receipt])
  async fetchReceipts(@CurrentUser() currentUser: ICurrentUser) {
    return await this.receiptService.findAll({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Receipt])
  async fetchMyReceipts(@CurrentUser() currentUser: ICurrentUser) {
    return await this.receiptService.findMyAll({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Receipt)
  async createReceipt(
    @Args('impUid') impUid: string,
    @Args('price') price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.receiptService.create({
      impUid,
      price,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Receipt)
  async deleteReceipt(
    @Args('impUid') impUid: string,
    @Args('price') price: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.receiptService.refund({
      impUid,
      price,
      currentUser,
    });
  }
}
