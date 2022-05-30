import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UsePointService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use({ currentUser }) {
    const user = await this.userRepository.findOne({
      email: currentUser.email,
    });

    if (user.points < 20) {
      return "You don't have enough point to enter the chat room";
    }

    return this.userRepository.save({
      where: { email: currentUser.email },
      points: user.points - 20,
    });
  }
}
