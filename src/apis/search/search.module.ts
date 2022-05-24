import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';
import { CommunityBoard } from '../communityBoard/entities/communityBoard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, CommunityBoard]),
    ElasticsearchModule.register({
      node: 'http://34.64.220.170:9200',
    }),
    // ElasticsearchModule.register({
    //   node: 'https://search-my-elasticsearch-wjqicfpsqui4spgpkg74hqzq4y.us-west-1.es.amazonaws.com:443',

    //   auth: {
    //     username: 'my-elasticsearch',
    //     password: 'Tls1641@',
    //   },
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // }),
  ],
  providers: [
    SearchResolver, //
    SearchService,
  ],
})
export class SearchModule {}
