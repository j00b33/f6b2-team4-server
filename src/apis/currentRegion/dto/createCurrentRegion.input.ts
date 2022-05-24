import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CurrentRegionInput {
  @Field(() => String)
  region: string;

  @Field(() => String, { nullable: true })
  regionDetail: string;
}
