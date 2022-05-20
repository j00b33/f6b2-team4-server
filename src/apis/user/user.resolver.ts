import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateUserInput } from './dto/user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateUserInput } from './dto/updateUser.input';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    //@Args("writer")

    @CurrentUser() currentUser: any, //우리가 만든 데코레이터 - context 있는 데이터를 뽑아오기위함
  ) {
    console.log('currentUser는?', currentUser);
    console.log('fetchUser 실행 완료 !!!');

    return this.userService.findOne({
      email: currentUser.email,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUserId(
    //@Args("writer")
    @Args('userId') userId: string,
  ) {
    return this.userService.findIdOne({
      userId,
    });
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    createUserInput.password = hashedPassword;

    return this.userService.create({ createUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: any, //
    @Args('originalPassword') originalPassword: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    const userEmail = currentUser.email;

    return await this.userService.update({
      userEmail,
      updateUserInput,
      originalPassword,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@CurrentUser() currentUser: any) {
    return this.userService.delete({ currentUser });
  }

  @Mutation(() => String)
  emailCheck(@Args('email') email: string) {
    return this.userService.sendToken({ email });
  }

  @Mutation(() => String)
  verification(
    @Args('email') email: string,
    @Args('token') token: string, //
  ) {
    return this.userService.checkToken({ email, token });
  }
}
