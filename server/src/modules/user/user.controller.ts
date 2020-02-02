import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * 用户注册
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async register(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.createUser(user);
  }

  /**
   * 用户更新
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async update(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.updateById(user.id, user);
  }

  /**
   * 更新用户密码
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('password')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() user: Partial<User>): Promise<User> {
    return await this.userService.updatePassword(user.id, user);
  }
}
