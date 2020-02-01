import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { marked } from '../article/markdown.util';
import { Comment } from './comment.entity';

/**
 * 扁平接口评论转为树形评论
 * @param list
 */
function buildTree(list) {
  let temp = {};
  let tree = [];

  for (let item of list) {
    temp[item.id] = item;
  }

  for (let i in temp) {
    if (temp[i].parentCommentId) {
      if (temp[temp[i].parentCommentId]) {
        if (!temp[temp[i].parentCommentId].children) {
          temp[temp[i].parentCommentId].children = [];
        }
        temp[temp[i].parentCommentId].children.push(temp[i]);
      } else {
        tree.push(temp[i]); // 父级可能被删除或者未通过，直接升级
      }
    } else {
      tree.push(temp[i]);
    }
  }

  return tree;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService
  ) {}

  /**
   * 创建评论
   * @param comment
   */
  async create(comment: Partial<Comment>): Promise<Comment> {
    const { articleId, contact, content } = comment;

    if (!articleId || !contact || !content) {
      throw new HttpException('缺失参数', HttpStatus.BAD_REQUEST);
    }

    const { html } = marked(content);
    comment.html = html;
    comment.pass = false;
    const newComment = await this.commentRepository.create(comment);
    await this.commentRepository.save(newComment);
    return newComment;
  }

  /**
   * 查询所有评论
   * 额外添加文章信息
   */
  async findAll(): Promise<Comment[]> {
    const data = await this.commentRepository.find();
    for (let d of data) {
      const article = await this.articleService.findById(d.articleId);
      Object.assign(d, { article });
    }
    return data;
  }

  /**
   * 获取指定评论
   * @param id
   */
  async findById(id): Promise<Comment> {
    return this.commentRepository.findOne(id);
  }

  /**
   * 获取文章评论
   * @param articleId
   */
  async getArticleComments(articleId) {
    const data = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.articleId=:articleId')
      .where('comment.pass=:pass')
      .setParameter('articleId', articleId)
      .setParameter('pass', true)
      .getMany();

    return buildTree(data);
  }

  async findByIds(ids): Promise<Array<Comment>> {
    return this.commentRepository.findByIds(ids);
  }

  /**
   * 更新评论
   * @param id
   * @param tag
   */
  async updateById(id, data: Partial<Comment>): Promise<Comment> {
    console.log(id, data);
    const old = await this.commentRepository.findOne(id);
    const newData = await this.commentRepository.merge(old, data);
    return this.commentRepository.save(newData);
  }

  async deleteById(id) {
    const tag = await this.commentRepository.findOne(id);
    return this.commentRepository.remove(tag);
  }
}
