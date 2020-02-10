import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { Article } from './article.entity';
import { marked } from './markdown.util';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService
  ) {}

  /**
   * 创建文章
   * @param article
   */
  async create(article: Partial<Article>): Promise<Article> {
    const { title } = article;
    const exist = await this.articleRepository.findOne({ where: { title } });

    if (exist) {
      throw new HttpException('文章标题已存在', HttpStatus.BAD_REQUEST);
    }

    let { content, tags } = article;
    const { html, toc } = content ? marked(content) : { html: null, toc: null };
    tags = await this.tagService.findByIds(('' + tags).split(','));
    const newArticle = await this.articleRepository.create({
      ...article,
      html,
      toc: JSON.stringify(toc),
      tags,
      needPassword: !!article.password,
    });
    await this.articleRepository.save(newArticle);
    return newArticle;
  }

  /**
   * 校验文章密码是否正确
   * @param id
   * @param password
   */
  async checkPassword(id, { password }): Promise<{ pass: boolean }> {
    const data = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.id=:id')
      .andWhere('article.password=:password')
      .setParameter('id', id)
      .setParameter('password', password)

      .getOne();
    return { pass: !!data };
  }

  /**
   * 获取所有文章
   */
  async findAll(status = null): Promise<Article[]> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .orderBy('publishAt', 'DESC');

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    return query.getMany();
  }

  /**
   * 获取文章归档
   */
  async getArchives(): Promise<{ [key: string]: Article[] }> {
    const data = await this.articleRepository.find({
      where: { status: 'publish' },
      order: { createAt: 'DESC' },
    } as any);
    let ret = {};

    data.forEach(d => {
      const year = new Date(d.createAt).getFullYear();

      if (!ret[year]) {
        ret[year] = [];
      }

      ret[year].push(d);
    });

    return ret;
  }

  /**
   * 获取指定文章信息
   * @param id
   */
  async findById(id, status = null): Promise<Article> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id=:id')
      .orWhere('article.title=:title')
      .setParameter('id', id)
      .setParameter('title', id);

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    return query.getOne();
  }

  /**
   * 更新指定文章
   * @param id
   * @param article
   */
  async updateById(id, article: Partial<Article>): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(id);
    let { content, tags } = article;
    const { html, toc } = content ? marked(content) : oldArticle;

    if (tags) {
      tags = await this.tagService.findByIds(('' + tags).split(','));
    }
    const newArticle = {
      ...article,
      html,
      toc: JSON.stringify(toc),
      needPassword: !!article.password,
    };

    if (tags) {
      Object.assign(newArticle, { tags });
    }

    const updatedArticle = await this.articleRepository.merge(
      oldArticle,
      newArticle
    );
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * 更新指定文章阅读量 + 1
   * @param id
   * @param article
   */
  async updateViewsById(id): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(id);
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      views: oldArticle.views + 1,
    });
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * 删除文章
   * @param id
   */
  async deleteById(id) {
    const article = await this.articleRepository.findOne(id);
    return this.articleRepository.remove(article);
  }
}
