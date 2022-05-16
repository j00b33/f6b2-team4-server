import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CurrentRegion {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  region: string;

  @Column()
  @Field(() => String, { nullable: true })
  regionDetail: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
