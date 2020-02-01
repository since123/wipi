import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 用户模块
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
// 文件模块
import { FileModule } from './modules/file/file.module';
import { File } from './modules/file/file.entity';
// 标签模块
import { TagModule } from './modules/tag/tag.module';
import { Tag } from './modules/tag/tag.entity';
// 文章模块
import { ArticleModule } from './modules/article/article.module';
import { Article } from './modules/article/article.entity';
// 评论模块
import { CommentModule } from './modules/comment/comment.module';
import { Comment } from './modules/comment/comment.entity';
// 系统模块
import { SettingModule } from './modules/setting/setting.module';
import { Setting } from './modules/setting/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 32771,
      username: 'root',
      password: 'root',
      database: 'wipi',
      entities: [User, File, Tag, Article, Comment, Setting],
      synchronize: true,
    }),
    UserModule,
    FileModule,
    TagModule,
    ArticleModule,
    CommentModule,
    SettingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
