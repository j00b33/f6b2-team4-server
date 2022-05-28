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

  async redisGetAll({ content, page }) {
    let pageSearch;
    if (content && page) {
      pageSearch = content + String(page);
      const mycache: Array<Board[]> = await this.cacheManager.get(pageSearch);
      return mycache;
    }
    const mycache: Array<Board[]> = await this.cacheManager.get(content);
    return mycache;
  }

  async elasticSearchAll({ content, page, pageSize }) {
    if (content && page && pageSize) {
      const result = await this.elasticsearchService.search({
        index: 'boardcontent',
        from: (page - 1) * pageSize,
        size: pageSize,
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

    if (content) {
      const result1 = await this.elasticsearchService.search({
        index: 'boardcontent',
        query: {
          bool: {
            must: { match: { content: content } },
            should: { match: { elasticdelete: 'alive' } },
            must_not: { match: { elasticdelete: 'dead' } },
          },
        },
      });
      return result1;
    }
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

  async redisSaveAll({ page, content, values }) {
    let pageSearch;
    if (content && page) {
      pageSearch = content + String(page);
      await this.cacheManager.set(
        pageSearch, //
        values,
        {
          ttl: 20,
        },
      );
      return;
    }

    await this.cacheManager.set(
      content, //
      values,
      {
        ttl: 20,
      },
    );
  }
}
