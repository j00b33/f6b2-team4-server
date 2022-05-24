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

  @Column()
  @Field(() => String)
  region: string;

  @Column({ default: 'null' })
  @Field(() => String, { nullable: true })
  regionDetail: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
