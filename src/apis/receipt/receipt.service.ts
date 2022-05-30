import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Connection, Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { Receipt, RECEIPT_STATUS_ENUM } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,

    private readonly iamportService: IamportService,

    private readonly connection: Connection,
  ) {}

  async findAll({ currentUser }) {
    return await this.receiptRepository.find({
      where: { user: currentUser },
      order: { purchasedAt: 'DESC' },
    });
  }

  async findMyAll({ currentUser }) {
    return await this.receiptRepository.find({
      where: { user: currentUser },
      order: { purchasedAt: 'DESC' },
    });
  }

  async create({ impUid, currentUser, price }) {
    const IAccessToken = await this.iamportService.getAccessToken();

    const IamportInformation = await this.iamportService.checkImpUid({
      IAccessToken,
      impUid,
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect(); // now, queryRunner is available
    await queryRunner.startTransaction('SERIALIZABLE'); // Transaction Start =======>

    try {
      if (IamportInformation.amount !== price) {
        await this.iamportService.cancelOrderWithUid({ IAccessToken, impUid });
        throw new UnprocessableEntityException(
          '지불한 가격과, 포인트 가격이 일치하지 않습니다',
        );
      }

      // User 검증 시작
      const userData = await this.userRepository.findOne({
        where: { id: currentUser.id },
      });
      const userID = await queryRunner.manager.findOne(User, {
        email: currentUser.email,
      });

      const receiptTable = this.receiptRepository.create({
        impUid: impUid,
        point: price / 10,
        price: Number(price),
        user: userID,
        status: RECEIPT_STATUS_ENUM.PURCHASED,
      });

      const updateUser = await this.userRepository.create({
        ...userData,
        points: userData.points + price / 10,
      });

      await queryRunner.manager.save(updateUser);
      await queryRunner.manager.save(receiptTable);

      await queryRunner.commitTransaction();
      return receiptTable;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async refund({ impUid, price, currentUser }) {
    const IAccessToken = await this.iamportService.getAccessToken();

    const IamportInformation = await this.iamportService.checkImpUid({
      IAccessToken,
      impUid,
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect(); // now, queryRunner is available
    await queryRunner.startTransaction(); // Transaction Start =======>

    try {
      // 이미 취소된 상품인지 검증
      const PurchaseStatus = await queryRunner.manager.findOne(Receipt, {
        where: { impUid },
        relations: ['user'],
      });

      const userData = await queryRunner.manager.findOne(User, {
        email: currentUser.email,
      });

      // 그 포인트를 이미 썼는지
      // 환불하려는 포인트가 지금 내가 있는 포인트보다 적을때만 환불 가능 [환불 페이지 필요]
      if (userData.points * 10 < price) {
        throw new UnprocessableEntityException(
          '보유 포인트가 환불 포인트보다 적습니다',
        );
      }

      // 구매자랑 환불자 비교 검증
      if (PurchaseStatus.user.id !== userData.id) {
        throw new UnprocessableEntityException(
          '구매자와 환불자가 일치하지 않습니다',
        );
      }

      // 환불하려는 금액과 구매한 금액이 같은지 검증
      if (PurchaseStatus.price !== price) {
        throw new UnprocessableEntityException(
          '구매한 금액과 환불할 금액이 일치하지 않습니다',
        );
      }
      // ============= 검증할때 걸린게 없다면 결제 취소 API 요청 =============
      await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: IAccessToken, // 아임포트 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
          amount: price, // 가맹점 클라이언트로부터 받은 환불금액
          //   merchant_uid: ,
        },
      });

      // 환불 결과
      const result = this.receiptRepository.create({
        impUid,
        price: IamportInformation.amount,
        point: IamportInformation.amount / 10,
        user: userData,
        status: RECEIPT_STATUS_ENUM.CANCELLED,
      });

      const updateUser = this.userRepository.create({
        ...userData,
        points: userData.points - price / 10,
      });

      await queryRunner.manager.save(result);
      await queryRunner.manager.save(updateUser);
      // commit 성공 확정
      await queryRunner.commitTransaction();

      // 최종 겨로가 프론트앤드에 돌려주기
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      // 연결 해제
      await queryRunner.release();
    }
  }
}
