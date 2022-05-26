import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cache } from 'cache-manager';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async redisGetAll({ content }) {
    const mycache: Array<Board[]> = await this.cacheManager.get(content);
    return mycache;
  }

  async elasticSearchAll({ content }) {
    const result = await this.elasticsearchService.search({
      index: 'boardcontent',
      query: {
        bool: {
          must: { match: { content: content } },
          should: { match: { elasticdelete: 'alive' } },
          must_not: { match: { elasticdelete: 'dead' } },
        },
      },
    });
    return result;
  }

  async elasticSearchCommnuinity({ content }) {
    const result = await this.elasticsearchService.search({
      index: 'communitycontent',
      query: {
        bool: {
          must: { match: { content: content } },
          should: { match: { elasticdelete: 'alive' } },
          must_not: { match: { elasticdelete: 'dead' } },
        },
      },
    });
    return result;
  }

  async redisSaveAll({ content, values }) {
    await this.cacheManager.set(
      content, //
      values,
      {
        ttl: 60,
      },
    );
  }
}
