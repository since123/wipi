import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly jwtService: JwtService
  ) {}

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
  findAll(@Request() req): Promise<Setting> {
    let token = req.headers.authorization;

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }

    try {
      this.jwtService.verify(token);
      return this.settingService.findAll(false, true);
    } catch (e) {
      return this.settingService.findAll(false, false);
    }
  }
}
