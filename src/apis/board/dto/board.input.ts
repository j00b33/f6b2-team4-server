import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  video: string;

  @Field(() => Int)
  likes: number;
}
