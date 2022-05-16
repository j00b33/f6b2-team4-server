import { InputType, PartialType } from '@nestjs/graphql';
import { CurrentRegionInput } from './createCurrentRegion.input';

@InputType()
export class UpdateCurrentRegionInput extends PartialType(CurrentRegionInput) {}
