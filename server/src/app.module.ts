import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 用户模块
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 32773,
      username: 'root',
      password: 'root',
      database: 'wipi',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
