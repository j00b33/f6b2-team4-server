import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  video: string;
}
