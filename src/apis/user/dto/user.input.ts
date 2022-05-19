import { Field, InputType } from '@nestjs/graphql';
import { CurrentRegionInput } from 'src/apis/currentRegion/dto/createCurrentRegion.input';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  myLang: string;

  @Field(() => String)
  newLang: string;

  @Field(() => CurrentRegionInput)
  currentRegion: CurrentRegionInput;
}
