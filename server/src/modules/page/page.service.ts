import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './page.entity';
import { marked } from '../article/markdown.util';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>
  ) {}

  /**
   * 新建页面
   * @param page
   */
  async create(page: Partial<Page>): Promise<Page> {
    const { name, path } = page;
    const exist = await this.pageRepository.findOne({ where: { path } });

    if (exist) {
      throw new HttpException('页面已存在', HttpStatus.BAD_REQUEST);
    }

    let { content } = page;
    const { html, toc } = content ? marked(content) : { html: null, toc: null };
    const newPage = await this.pageRepository.create({
      ...page,
      html,
      toc: JSON.stringify(toc),
    });
    await this.pageRepository.save(newPage);
    return newPage;
  }

  /**
   * 获取所有页面
   */
  async findAll(status = null): Promise<Page[]> {
    const query = this.pageRepository
      .createQueryBuilder('page')
      .orderBy('publishAt', 'DESC');

    if (status) {
      query.andWhere('page.status=:status').setParameter('status', status);
    }

    return query.getMany();
  }

  /**
   * 获取指定页面信息
   * @param id
   */
  async findById(id): Promise<Page> {
    const query = this.pageRepository
      .createQueryBuilder('page')
      .where('page.id=:id')
      .orWhere('page.path=:path')
      .setParameter('id', id)
      .setParameter('path', id);

    return query.getOne();
  }

  /**
   * 更新指定页面
   * @param id
   * @param article
   */
  async updateById(id, page: Partial<Page>): Promise<Page> {
    const old = await this.pageRepository.findOne(id);
    let { content } = page;
    const { html, toc } = content ? marked(content) : old;

    const newPage = {
      ...page,
      html,
      toc: JSON.stringify(toc),
    };

    const updatedPage = await this.pageRepository.merge(old, newPage);
    return this.pageRepository.save(updatedPage);
  }

  /**
   * 删除页面
   * @param id
   */
  async deleteById(id) {
    const page = await this.pageRepository.findOne(id);
    return this.pageRepository.remove(page);
  }
}
