import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      //누구든지 열어볼 수 있다
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );

    //개발 환경

    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    // 배포환경 이부분 뒤에 저장 , 'https://myfrontsite.com'

    // // 배포환경;
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.team04backend.shop; SameSite=None; Secure; httpOnly;`,
    );

    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      //누구든지 열어볼 수 있다
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '1h' },
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
    // 여기로 온다
    res.redirect('http://localhost:5501/frontend/login/index.html');
  }
}
