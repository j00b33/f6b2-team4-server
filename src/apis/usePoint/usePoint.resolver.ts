import { Resolver, Mutation } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { User } from '../user/entities/user.entity';
import { UsePointService } from './usePoint.service';

@Resolver()
export class UsePointResolver {
  constructor(private readonly usePointService: UsePointService) {}

  @Mutation(() => [User])
  usePoints(@CurrentUser() currentUser: ICurrentUser) {
    return this.usePointService.use({ currentUser });
  }
}
