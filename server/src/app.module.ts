import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 鉴权模块
import { AuthModule } from './modules/auth/auth.module';
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
// 邮件模块
import { SMTPModule } from './modules/smtp/smtp.module';
import { SMTP } from './modules/smtp/smtp.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 32771,
      username: 'root',
      password: 'root',
      database: 'wipi',
      entities: [User, File, Tag, Article, Comment, Setting, SMTP],
      synchronize: true,
    }),
    UserModule,
    FileModule,
    TagModule,
    ArticleModule,
    CommentModule,
    SettingModule,
    SMTPModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
