import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

//google 로그인용 passport
//yarn add passport-google-oauth20
@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      //검중부, Bearer 뺴고 넣어야함, 내장 되어있음 .fromauthheadera
      clientID: '입력하기', //구굴에서 들고오셈
      clientSecret: '입력하기',
      callbackURL: '입력하기',
      scope: ['email', 'profile'], //사이트마다 다르다
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    return {
      email: profile.emails[0].value,
      password: '1111',
      name: profile.displayName, //req.user라는 이름에  contest 로 들어감
      age: 0,
    };
  }
}
