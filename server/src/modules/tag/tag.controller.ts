import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 添加标签
   * @param tag
   */
  @Post()
  create(@Body() tag) {
    return this.tagService.create(tag);
  }

  /**
   * 获取所有标签
   */
  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  /**
   * 获取指定标签
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.tagService.findById(id);
  }

  /**
   * 获取指定标签，包含相关文章信息
   * @param id
   */
  @Get(':id/article')
  getArticleById(@Param('id') id) {
    return this.tagService.getArticleById(id);
  }

  /**
   * 更新标签
   * @param id
   * @param tag
   */
  @Patch(':id')
  updateById(@Param('id') id, @Body() tag) {
    return this.tagService.updateById(id, tag);
  }

  /**
   * 删除标签
   * @param id
   */
  @Delete(':id')
  deleteById(@Param('id') id) {
    return this.tagService.deleteById(id);
  }
}
