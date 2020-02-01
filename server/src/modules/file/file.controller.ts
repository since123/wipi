import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件
   * @param file
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  uploadFile(@UploadedFile() file) {
    return this.fileService.uploadFile(file);
  }

  /**
   * 获取所有文件
   */
  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  /**
   * 获取指定文件
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.fileService.findById(id);
  }

  /**
   * 删除文件
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.fileService.deleteById(id);
  }
}
