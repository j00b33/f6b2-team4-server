import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCommunityBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image: string;
}
