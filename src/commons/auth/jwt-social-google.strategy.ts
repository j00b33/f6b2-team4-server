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
      clientID: process.env.GOOGLE_KEY, //구굴에서 들고오셈
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'], //사이트마다 다르다
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    if (!profile.photos[0].value) {
      profile.photos[0].value = 'URL';
    }

    return {
      email: profile.emails[0].value,
      password: '1111',
      name: profile.displayName, //req.user라는 이름에  contest 로 들어감
      myLang: 'Korean',
      newLang: 'English',
      image: profile.photos[0].value,
      provider: profile.provider,
    };
  }
}
