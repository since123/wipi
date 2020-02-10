import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ViewService } from './view.service';
import { View } from './view.entity';

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  );
}

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  /**
   * 添加访问
   * @param tag
   */
  @Post()
  create(@Request() req, @Body() data) {
    const userAgent = req.headers['user-agent'];
    const url = data.url;
    return this.viewService.create(getClientIP(req), userAgent, url);
  }

  /**
   * 获取所有访问
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<View[]> {
    return this.viewService.findAll();
  }

  /**
   * 获取指定访问
   * @param id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id) {
    return this.viewService.findById(id);
  }

  /**
   * 删除访问
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.viewService.deleteById(id);
  }
}
