import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingModule } from '../setting/setting.module';
import { SMTPService } from './smtp.service';
import { SMTPController } from './smtp.controller';
import { SMTP } from './smtp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SMTP]), SettingModule],
  controllers: [SMTPController],
  providers: [SMTPService],
})
export class SMTPModule {}
