import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import axios from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email }, //
    });
  }
  async findIdOne({ userId }) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  getWelcomeTemplate({ createUserInput }) {
    return `
          <html>
              <body>
                  <h1 style="color: #434343">Welcome, ${createUserInput.name}!</h1>
                  <img src="https://storage.googleapis.com/langbee/47.png" style="display: flex;
                  flex-direction: column; align-items: center; width: 600px;"></img>
              </body>
          </html>
      `;
  }

  async create({ createUserInput }) {
    const user = await this.userRepository.findOne({
      email: createUserInput.email,
    });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다');

    const appKey = process.env.EMAIL_APP_KEY;
    const XSecretKey = process.env.EMAIL_X_SECRETE_KEY;
    const sender = process.env.EMAIL_SENDER;
    const template = this.getWelcomeTemplate({ createUserInput });

    await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`,
      {
        senderAddress: sender,
        title: 'Welcome to LangBee!',
        body: template,
        receiverList: [
          {
            receiveMailAddr: createUserInput.email,
            receiveType: 'MRT0',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    return await this.userRepository.save(createUserInput);
  }

  async update({ userEmail, updateUserInput, originalPassword }) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    let isAuth;
    if (user['password'].length > 4) {
      isAuth = await bcrypt.compare(originalPassword, user.password);
      if (!isAuth)
        throw new UnprocessableEntityException('암호가 일치하지 않습니다');
    }

    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    } else if (updateUserInput.password === '') {
      updateUserInput.password = await bcrypt.hash(originalPassword, 10);
    } else {
      updateUserInput.password = await bcrypt.hash(originalPassword, 10);
    }

    const newUser = {
      ...user,
      ...updateUserInput,
    };
    return await this.userRepository.save(newUser);
  }

  async delete({ currentUser }) {
    const result = await this.userRepository.softDelete({ id: currentUser.id });
    return result.affected ? true : false;
  }

  async sendToken({ email }) {
    const appKey = process.env.EMAIL_APP_KEY;
    const XSecretKey = process.env.EMAIL_X_SECRETE_KEY;
    const sender = process.env.EMAIL_SENDER;

    const tokenNumber = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );

    await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`,
      {
        senderAddress: sender,
        title: 'LangBee Confirmation',
        body: `CONFIRMATION: ${tokenNumber}`,
        receiverList: [
          {
            receiveMailAddr: email,
            receiveType: 'MRT0',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    await this.cacheManager.set(
      email, //
      tokenNumber,
      {
        ttl: 1000,
      },
    );

    return '토큰 번호 발송';
  }

  async checkToken({ email, token }) {
    const realToken = await this.cacheManager.get(email);
    if (realToken === token) {
      return true;
    } else {
      return false;
    }
  }
}
