import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //,
    private readonly userService: UserService,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      //누구든지 열어볼 수 있다
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' },
    );

    //개발 환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포환경;
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`,
    // );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN, expiresIn: '1d' },
    );
  }

  async userCheck({ req, res }) {
    //1. 가입 확인
    let user = await this.userService.findOne({
      email: req.user.email,
    });

    //2. 회원 가입
    if (!user) {
      user = await this.userService.create({
        createUserInput: req.user,
      });
    }
    //3. 로그인
    this.setRefreshToken({ user, res });
    //여기로 온다
    res.redirect(
      'http://localhost:5500/homework/main-project/frontend/login/index.html',
    );
  }
}
