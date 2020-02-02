import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  createToken(id: number | string) {
    const accessToken = this.jwtService.sign({ id });
    return accessToken;
  }

  async login(user: Partial<User>) {
    const data = await this.userService.login(user);
    const token = this.createToken(data.id);
    return Object.assign(data, { token });
  }

  async validateUser(payload: User): Promise<any> {
    return await this.userService.findById(payload.id);
  }
}
