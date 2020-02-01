import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 创建评论
   * @param comment
   */
  @Post()
  create(@Body() comment) {
    return this.commentService.create(comment);
  }

  /**
   * 获取所有评论
   */
  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  /**
   * 获取指定评论
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.commentService.findById(id);
  }

  /**
   * 获取文章评论
   * @param articleId
   */
  @Get('article/:articleId')
  getArticleComments(@Param('articleId') articleId) {
    return this.commentService.getArticleComments(articleId);
  }

  /**
   * 更新评论
   * @param id
   * @param tag
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() data) {
    return this.commentService.updateById(id, data);
  }

  /**
   * 删除评论
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.commentService.deleteById(id);
  }
}
