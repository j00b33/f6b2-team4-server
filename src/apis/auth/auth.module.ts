import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    JwtRefreshStrategy,
    AuthResolver, //
    AuthService,
    UserService,
  ],
  // controllers: [
  //   AuthController, //
  // ],
})
export class AuthModule {}
