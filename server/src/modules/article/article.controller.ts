import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 创建文章
   * @param article
   */
  @Post()
  create(@Body() article) {
    return this.articleService.create(article);
  }

  /**
   * 获取所有文章
   */
  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.articleService.findById(id);
  }

  /**
   * 校验文章密码
   * @param id
   * @param article
   */
  @Post(':id/checkPassword')
  @HttpCode(HttpStatus.OK)
  checkPassword(@Param('id') id, @Body() article) {
    return this.articleService.checkPassword(id, article);
  }

  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Param('id') id) {
    return this.articleService.updateViewsById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param article
   */
  @Patch(':id')
  updateById(@Param('id') id, @Body() article) {
    return this.articleService.updateById(id, article);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  deleteById(@Param('id') id) {
    return this.articleService.deleteById(id);
  }
}
