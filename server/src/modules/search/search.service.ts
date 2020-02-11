import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { Search } from './search.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Search)
    private readonly searchRepository: Repository<Search>,
    private readonly articleService: ArticleService
  ) {}

  /**
   * 搜素文章
   * @param type
   */
  async searchArticle(type, keyword) {
    const articles = await this.articleService.search(keyword);
    await this.addRecord(type, keyword);
    return articles;
  }

  async addRecord(type, keyword) {
    const exist = await this.searchRepository.findOne({
      where: { type, keyword },
    });

    if (exist) {
      const count = exist.count;
      const newData = await this.searchRepository.merge(exist, {
        count: count + 1,
      });
      await this.searchRepository.save(newData);
      return newData;
    }

    const newData = await this.searchRepository.create({ type, keyword });
    await this.searchRepository.save(newData);
  }

  /**
   * 获取所有搜索记录
   */
  async findAll(): Promise<Search[]> {
    return this.searchRepository.find({ order: { createAt: 'DESC' } });
  }

  /**
   * 删除搜索记录
   * @param id
   */
  async deleteById(id) {
    const data = await this.searchRepository.findOne(id);
    return this.searchRepository.remove(data);
  }
}
