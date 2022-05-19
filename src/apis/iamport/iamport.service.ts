import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  async getAccessToken() {
    const IamportAccessToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: '9817535831783963',
        imp_secret:
          'AmcxitTEDSW2nOwLlkYS0mCh5Af7MDkmZwUiZOXDGTG4IcQ3xOWxayPg94nVHHiHdcZd0XQHQwLzJCCg',
      },
    });
    const IAccessToken = IamportAccessToken.data.response.access_token;
    return IAccessToken;
  }

  async getImpUid({ IAccessToken, impUid }) {
    // 결제 상세내역 조회 - 결제 내역의 impUid
    let GetimpUid;
    try {
      GetimpUid = await axios.get(`https://api.iamport.kr/payments/${impUid}`, {
        headers: {
          'Content-Type': 'application/json', // "Content-Type": "application/json"
          Authorization: `Bearer ${IAccessToken}`, // 발행된 액세스 토큰
        },
      });
    } catch (error) {
      if (error.response.status === 404) {
        throw new UnprocessableEntityException('Invalid impUid');
      }
    }
    const PurchaseData = GetimpUid.data.response; // 유저가 지불한 돈 = 아임포트에 유저가 지불했다고 저장되어있는 돈

    return PurchaseData;
  }

  async cancelOrderWithUid({ IAccessToken, impUid }) {
    await axios({
      url: `https://api.iamport.kr/payments/cancel/`,
      method: 'post', // GET method
      data: { imp_uid: `${impUid}` },
      headers: {
        'Content-Type': 'application/json', // "Content-Type": "application/json"
        Authorization: `Bearer ${IAccessToken}`, // 발행된 액세스 토큰
      },
    });
    console.log('canceled order');
  }

  async checkImpUid({ IAccessToken, impUid }) {
    let fromImport;
    try {
      fromImport = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`,
        method: 'get', // GET method
        headers: {
          'Content-Type': 'application/json', // "Content-Type": "application/json"
          Authorization: `Bearer ${IAccessToken}`, // 발행된 액세스 토큰
        },
      });
    } catch (error) {
      if (error.response.status === 409) {
        console.log('409!!');
        throw new ConflictException('impUid 주문 번호가 일치하지 않습니다');
      }
    }
    // .catch((error) => {
    //   this.cancelOrderWithUid({ accessToken, impUid });
    //   console.log(error);
    // });
    console.log(fromImport);
    console.log('authorized impUid');

    return fromImport.data.response;
  }
}
