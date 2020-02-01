import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
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
  create(@Body() data) {
    return this.smtpService.create(data);
  }

  /**
   * 获取所有邮件记录
   */
  @Get()
  findAll(): Promise<SMTP[]> {
    return this.smtpService.findAll();
  }

  /**
   * 删除邮件记录
   * @param id
   */
  @Delete(':id')
  deleteById(@Param('id') id) {
    return this.smtpService.deleteById(id);
  }
}
