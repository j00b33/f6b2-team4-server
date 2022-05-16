import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { AuthModule } from './apis/auth/auth.module';
import { BoardModule } from './apis/board/board.module';
import { CommunityBoardModule } from './apis/communityBoard/communityBoard.module';
import { UserModule } from './apis/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { CommentModule } from './apis/comment/comment.module';
import { FileModule } from './apis/file/file.module';
import { BoardImageModule } from './apis/boardImage/boardImage.module';
import { SaveModule } from './apis/save/save.module';
import { CurrentRegion } from './apis/currentRegion/entities/currentRegion.entity';

@Module({
  imports: [
    AuthModule,
    BoardModule,
    BoardImageModule,
    UserModule,
    CommunityBoardModule,
    CommentModule,
    CurrentRegion,
    FileModule,
    SaveModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '10.127.112.4',
      host: 'my-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'teamproject',
      entities: [__dirname + '/apis/**/*.entity.*'], //각 경로 설정
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      // url: 'redis://:oj4tpyWX@10.140.0.3:6379',
      isGlobal: true,
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
