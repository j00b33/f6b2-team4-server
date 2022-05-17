import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Field(() => Int)
  points: number;

  //   @JoinColumn()
  //   @OneToOne(() => CurrentRegion)
  //   currentRegion: CurrentRegion;
}
