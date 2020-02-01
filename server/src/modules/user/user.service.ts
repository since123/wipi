import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * 创建用户
   * @param user
   */
  async createUser(user: Partial<User>): Promise<User> {
    const { name } = user;
    const existUser = await this.userRepository.findOne({ where: { name } });

    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * 用户登录
   * @param user
   */
  async login(user: Partial<User>): Promise<User> {
    const { name, password } = user;
    const existUser = await this.userRepository.findOne({ where: { name } });

    if (
      !existUser ||
      !(await User.comparePassword(password, existUser.password))
    ) {
      throw new HttpException(
        '用户名或密码错误',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    return existUser;
  }

  /**
   * 获取指定标签
   * @param id
   */
  async findById(id): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
