import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /**
   * 更新设置
   * @param tag
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  update(@Body() setting) {
    return this.settingService.update(setting);
  }

  /**
   * 获取设置
   */
  @Post('/get')
  @HttpCode(HttpStatus.OK)
  findAll(@Body() user): Promise<Setting> {
    return this.settingService.findAll(user);
  }
}
