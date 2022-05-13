import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthResovler } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AuthController } from './auth.controller';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
    AuthResovler, //
    AuthService,
    UserService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
