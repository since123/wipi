import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting } from './setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), UserModule],
  exports: [SettingService],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
