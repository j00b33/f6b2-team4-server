import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CurrentRegion } from 'src/apis/currentRegion/entities/currentRegion.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  myLang: string;

  @Column()
  @Field(() => String)
  newLang: string;

  @Column()
  @Field(() => String)
  image: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ default: 0 })
  @Field(() => Int)
  points: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => CurrentRegion)
  currentRegion: CurrentRegion;
}
