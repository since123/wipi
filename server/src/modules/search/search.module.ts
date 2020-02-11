import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from '../article/article.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Search } from './search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Search]), ArticleModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
