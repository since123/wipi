import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { client } from './elasticsearch.client';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 搜索文章
   * @param keyword
   */
  @Get('/article')
  async searchArticle(@Query('keyword') keyword) {
    const data = await this.searchService.searchArticle('article', keyword);
    return data;
  }

  /**
   * 获取搜索记录
   */
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.searchService.findAll();
  }

  /**
   * 删除文件
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.searchService.deleteById(id);
  }
}
