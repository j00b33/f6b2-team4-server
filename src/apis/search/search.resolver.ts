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
    @Args('content') content: string,
    @Args('page', { nullable: true }) page: number,
    @Args('pageSize', { nullable: true }) pageSize: number,
    //
  ) {
    //1. 레디스에서 들고온다
    const redisGet = await this.searchService.redisGetAll({ content, page });
    if (redisGet) {
      console.log('😇', 'REDIS GET');
      redisGet.forEach((e) => {
        e['createdAt'] = new Date(e['createdat']);
        e['updatedAt'] = new Date(e['updatedat']);
        e['deletedAt'] = new Date(e['deletedat']);
      });
      return redisGet;
    }

    //2. 레디스에 없으면 일라스틱에서 들고옴
    const elasticGet = await this.searchService.elasticSearchAll({
      content,
      page,
      pageSize,
    });

    const values = [];
    console.log(elasticGet);
    for (let i = 0; i < elasticGet['hits']['hits'].length; i++) {
      const all = elasticGet['hits']['hits'][i]['_source'];

      all['commentsCount'] = all['commentscount'];
      all['createdAt'] = new Date(all['createdat']);
      all['updatedAt'] = new Date(all['updatedat']);
      all['deletedAt'] = new Date(all['deletedat']);

      all['writer'] = {
        id: all['writerid'],
        name: all['name'],
        email: all['email'],
        myLang: all['mylang'],
        newLang: all['newlang'],
        image: all['boardimage'],
        password: all['password'],
        points: all['points'],
        boardCounts: all['boardcounts'],
        communityBoardCounts: all['communityboardcounts'],
      };

      values.push(all);
    }
    values.sort((a, b) => b.createdAt - a.createdAt);

    await this.searchService.redisSaveAll({ page, content, values });

    console.log('🥲 from elastic');
    return values;
  }

  //   @Query(() => [CommunityBoard])
  //   async searchCommnunityContent(
  //     @Args('content') content: string, //
  //   ) {
  //     // 1. 레디스에서 들고온다
  //     const redisGet = await this.searchService.redisGetAll({ content });
  //     if (redisGet) {
  //       console.log('😇from redis');
  //       return redisGet;
  //     }

  //     //2. 레디스에 없으면 일라스틱에서 들고옴
  //     const elasticGet = await this.searchService.elasticSearchCommnuinity({
  //       content,
  //     });

  //     const values = [];
  //     for (let i = 0; i < elasticGet['hits']['hits'].length; i++) {
  //       const all = elasticGet['hits']['hits'][i]['_source'];

  //       console.log('🍌', all);
  //       values.push(all);
  //     }

  //     await this.searchService.redisSaveAll({ content, values });

  //     console.log('🥲 from elastic');
  //     return values;
  //   }
  //}
}
