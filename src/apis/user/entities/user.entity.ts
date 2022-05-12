import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
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
  password: string;

  //   @JoinColumn()
  //   @OneToOne(() => CurrentRegion)
  //   currentRegion: CurrentRegion;
}
