import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCommunityBoardInput } from './createCommunityBoard.input';

@InputType()
export class UpdateCommunityBoardInput extends PartialType(
  CreateCommunityBoardInput,
) {}
