import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  myLang: string;

  @Field(() => String)
  newLang: string;

  @Field(() => String, { nullable: true })
  currentRegion: string;
}
