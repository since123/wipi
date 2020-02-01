import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingModule } from '../setting/setting.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File]), SettingModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
