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
  async findAll(): Promise<Article[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .getMany();
  }

  /**
   * 获取指定文章信息
   * @param id
   */
  async findById(id): Promise<Article> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id=:id')
      .setParameter('id', id)
      .getOne();
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
