import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /**
   * 更新设置
   * @param tag
   */
  @Post()
  update(@Body() setting) {
    return this.settingService.update(setting);
  }

  /**
   * 获取设置
   */
  @Get()
  findAll(): Promise<Setting> {
    return this.settingService.findAll();
  }
}
