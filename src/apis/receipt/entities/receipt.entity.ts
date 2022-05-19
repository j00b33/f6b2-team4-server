import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RECEIPT_STATUS_ENUM {
  PURCHASED = 'PURCHASED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(RECEIPT_STATUS_ENUM, {
  name: 'RECEIPT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @Column()
  @Field(() => Int)
  price: number;

  @CreateDateColumn()
  @Field(() => Date)
  purchasedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @Column({ type: 'enum', enum: RECEIPT_STATUS_ENUM })
  @Field(() => RECEIPT_STATUS_ENUM)
  status: RECEIPT_STATUS_ENUM;
}
