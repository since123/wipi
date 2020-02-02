import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.createUser({ name: 'wipi', password: 'wipi' });
  }

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
   * 获取指定用户
   * @param id
   */
  async findById(id): Promise<User> {
    return this.userRepository.findOne(id);
  }

  /**
   * 更新指定用户
   * @param id
   */
  async updateById(id, user): Promise<User> {
    const oldUser = await this.userRepository.findOne(id);
    delete user.password;
    const newUser = await this.userRepository.merge(oldUser, user);
    return this.userRepository.save(newUser);
  }

  /**
   * 更新指定用户密码
   * @param id
   */
  async updatePassword(id, user): Promise<User> {
    const existUser = await this.userRepository.findOne(id);
    const { oldPassword, newPassword } = user;

    if (
      !existUser ||
      !(await User.comparePassword(oldPassword, existUser.password))
    ) {
      throw new HttpException(
        '用户名或密码错误',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    let hashNewPassword = User.encryptPassword(newPassword);
    const newUser = await this.userRepository.merge(existUser, {
      password: hashNewPassword,
    });
    return this.userRepository.save(newUser);
  }
}
