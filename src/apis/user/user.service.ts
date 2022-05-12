import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email }, //
    });
  }

  async create({ createUserInput }) {
    const user = await this.userRepository.findOne({
      email: createUserInput.email,
    });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다');
    return await this.userRepository.save(createUserInput);
  }

  async update({ userEmail, updateUserInput, originalPassword }) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    const isAuth = await bcrypt.compare(originalPassword, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('암호가 일치하지 않습니다');

    updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);

    const newUser = {
      ...user,
      ...updateUserInput,
    };
    return await this.userRepository.save(newUser);
  }

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }
}
