import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SMTPService } from './smtp.service';
import { SMTP } from './smtp.entity';

@Controller('smtp')
export class SMTPController {
  constructor(private readonly smtpService: SMTPService) {}

  /**
   * 发送邮件
   * @param data
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data) {
    return this.smtpService.create(data);
  }

  /**
   * 获取所有邮件记录
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<SMTP[]> {
    return this.smtpService.findAll();
  }

  /**
   * 删除邮件记录
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.smtpService.deleteById(id);
  }
}
