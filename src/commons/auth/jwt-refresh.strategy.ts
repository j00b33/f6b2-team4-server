import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      //검중부, Bearer 뺴고 넣어야함, 내장 되어있음 .fromauthheadera
      jwtFromRequest: (req) => {
        console.log(req.headers);
        const bakeCookie = req.headers.cookie.split(' ');
        const result = bakeCookie[bakeCookie.length - 1].replace(
          'refreshToken=',
          '',
        ); //
        console.log(result);
        return result;
      },
      secretOrKey: 'myRefreshKey', //이부분이 다다름
    });
  }

  validate(payload) {
    // 실패 또는 성공여부를 알려줌
    //검증완료되면 실행
    console.log(payload);
    return {
      id: payload.sub, //리턴이 된거임 context 라는 곳으로
      email: payload.email,
    };
  }
}
