import { Resolver, Query, Args } from '@nestjs/graphql';
import { Board } from '../board/entities/board.entity';
import { CommunityBoard } from '../communityBoard/entities/communityBoard.entity';
import { SearchService } from './search.service';

@Resolver()
export class SearchResolver {
  constructor(
    private readonly searchService: SearchService, //
  ) {}

  @Query(() => [Board])
  async searchBoardContent(
    @Args('content') content: string, //
  ) {
    //1. 레디스에서 들고온다
    const redisGet = await this.searchService.redisGetAll({ content });
    if (redisGet) {
      console.log('😇from redis');
      return redisGet;
    }

    //2. 레디스에 없으면 일라스틱에서 들고옴
    const elasticGet = await this.searchService.elasticSearchAll({
      content,
    });

    const values = [];
    console.log(elasticGet);
    for (let i = 0; i < elasticGet['hits']['hits'].length; i++) {
      const all = elasticGet['hits']['hits'][i]['_source'];

      console.log('🍌', all);
      values.push(all);
    }

    await this.searchService.redisSaveAll({ content, values });

    console.log('🥲 from elastic');
    return values;
  }

  @Query(() => [CommunityBoard])
  async searchCommnunityContent(
    @Args('content') content: string, //
  ) {
    // 1. 레디스에서 들고온다
    const redisGet = await this.searchService.redisGetAll({ content });
    if (redisGet) {
      console.log('😇from redis');
      return redisGet;
    }

    //2. 레디스에 없으면 일라스틱에서 들고옴
    const elasticGet = await this.searchService.elasticSearchCommnuinity({
      content,
    });

    const values = [];
    for (let i = 0; i < elasticGet['hits']['hits'].length; i++) {
      const all = elasticGet['hits']['hits'][i]['_source'];

      console.log('🍌', all);
      values.push(all);
    }

    await this.searchService.redisSaveAll({ content, values });

    console.log('🥲 from elastic');
    return values;
  }
}
