import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { TagModule } from '../tag/tag.module';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TagModule],
  exports: [ArticleService],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
