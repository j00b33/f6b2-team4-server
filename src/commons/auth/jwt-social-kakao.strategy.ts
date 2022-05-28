import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

//google 로그인용 passport
//yarn add passport-google-oauth20
@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      //검중부, Bearer 뺴고 넣어야함, 내장 되어있음 .fromauthheadera
      clientID: process.env.KAKAO_KEY, //카카오
      callbackURL: 'https://langbee.shop/login/kakao',
      //사이트마다 다르다
      scope: ['profile_nickname', 'account_email', 'profile_image'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log('카카오', accessToken);
    console.log(refreshToken);
    console.log(profile);

    if (!profile._json.properties.profile_image) {
      profile._json.properties.profile_image = 'URL';
    }

    return {
      email: profile._json.kakao_account.email,
      password: '0000',
      name: profile.displayName, //req.user라는 이름에  contest 로 들어감
      myLang: '한국어',
      newLang: 'English',
      provider: profile.provider,
      image: profile._json.properties.profile_image,
    };
  }
}
