import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly userService: UserService
  ) {}

  /**
   * 获取系统设置
   */
  async findAll(user?: User, innerInvoke = false): Promise<Setting> {
    const data = await this.settingRepository.find();
    const res = data[0];

    if (innerInvoke) {
      return res;
    }

    const filterRes = [
      'systemUrl',
      'systemTitle',
      'systemLogo',
      'systemFavicon',
      'systemFooterInfo',
      'seoKeyword',
      'seoDesc',
    ].reduce((a, c) => {
      a[c] = res[c];
      return a;
    }, {}) as Setting;

    if (user) {
      const ret = await this.userService.findById(user.id);
      if (ret) {
        return res;
      } else {
        return filterRes;
      }
    } else {
      return filterRes;
    }
  }

  /**
   * 更新系统设置
   * @param id
   * @param setting
   */
  async update(setting: Partial<Setting>): Promise<Setting> {
    const old = await this.settingRepository.find();

    const updatedTag =
      old && old[0]
        ? await this.settingRepository.merge(old[0], setting)
        : await this.settingRepository.create(setting);
    return this.settingRepository.save(updatedTag);
  }
}
