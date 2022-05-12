import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {} //전체를 들고와도 되고 안들고 와도 되고
