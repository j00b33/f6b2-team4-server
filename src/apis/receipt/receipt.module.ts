import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { Receipt } from './entities/receipt.entity';
import { ReceiptResolver } from './receipt.resolver';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, User])],
  providers: [ReceiptResolver, ReceiptService, IamportService],
})
export class ReceiptModule {}
