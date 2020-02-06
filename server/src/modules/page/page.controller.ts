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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PageService } from './page.service';
import { Page } from './page.entity';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  /**
   * 创建页面
   * @param page
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() page) {
    return this.pageService.create(page);
  }

  /**
   * 获取所有文章
   */
  @Get()
  findAll(@Query('status') status): Promise<Page[]> {
    return this.pageService.findAll(status);
  }

  /**
   * 获取指定页面
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.pageService.findById(id);
  }

  /**
   * 更新页面
   * @param id
   * @param page
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() page) {
    return this.pageService.updateById(id, page);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.pageService.deleteById(id);
  }
}
