import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: Omit<User, 'id'>; //엔티티에서 골라온다
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    //1. 가입 확인
    const user = await this.userService.findOne({ email: req.user.email });
    // 2. 회원 가입
    // if (!user) {
    //   user = await this.userService.create({
    //     email: req.user.email,
    //     hashedPassword: req.user.password,
    //     name: req.user.name,
    //     age: req.user.age,
    //   });
    // }
    //3. 로그인
    this.authService.setRefreshToken({ user, res });
    //여기로 온다
    res.redirect(
      'http://localhost:5500/class/21-03-login-google/frontend/social-login.html',
    );
  }
}
