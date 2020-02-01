import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as nuid from 'nuid';
import { SettingService } from '../setting/setting.service';
import { File } from './file.entity';

let OSS = require('ali-oss');

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly settingService: SettingService
  ) {}

  /**
   * 上传文件
   * @param file
   */
  async uploadFile(file: any): Promise<File> {
    const { originalname, mimetype, size, buffer } = file;
    const filename = `/${dayjs().format(
      'YYYY-MM-DD'
    )}/${nuid.next()}/${originalname}`;
    const {
      ossRegion,
      ossAccessKeyId,
      ossBucket,
      ossAccessKeySecret,
    } = await this.settingService.findAll();
    if (!ossRegion || !ossAccessKeyId || !ossBucket || !ossAccessKeySecret) {
      throw new HttpException('请完善 OSS 配置', HttpStatus.BAD_REQUEST);
    }
    let client = new OSS({
      region: ossRegion,
      accessKeyId: ossAccessKeyId,
      accessKeySecret: ossAccessKeySecret,
      bucket: ossBucket,
    });
    const { url } = await client.put(filename, buffer);
    const newFile = await this.fileRepository.create({
      originalname,
      filename,
      url,
      type: mimetype,
      size,
    });
    await this.fileRepository.save(newFile);
    return newFile;
  }

  /**
   * 获取所有文件
   */
  async findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  /**
   * 获取指定文件
   * @param id
   */
  async findById(id): Promise<File> {
    return this.fileRepository.findOne(id);
  }

  async findByIds(ids): Promise<Array<File>> {
    return this.fileRepository.findByIds(ids);
  }

  /**
   * 删除文件
   * @param id
   */
  async deleteById(id) {
    const tag = await this.fileRepository.findOne(id);
    const {
      ossRegion,
      ossAccessKeyId,
      ossBucket,
      ossAccessKeySecret,
    } = await this.settingService.findAll();
    if (!ossRegion || !ossAccessKeyId || !ossBucket || !ossAccessKeySecret) {
      throw new HttpException('请完善 OSS 配置', HttpStatus.BAD_REQUEST);
    }
    let client = new OSS({
      region: ossRegion,
      accessKeyId: ossAccessKeyId,
      accessKeySecret: ossAccessKeySecret,
      bucket: ossBucket,
    });
    await client.delete(tag.filename);
    return this.fileRepository.remove(tag);
  }
}
