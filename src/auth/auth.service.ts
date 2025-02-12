import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOnebyUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, user._id);
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge:
        +this.configService.get<string>('JWT_EXPIRE_REFRESH') *
        +this.configService.get<string>('TIME_MULTIPLY_REFRESH'),
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  createRefreshToken = (payload: Object) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(
        +this.configService.get<string>('JWT_EXPIRE_REFRESH') *
          +this.configService.get<string>('TIME_MULTIPLY_REFRESH'),
      ),
    });
    return refresh_token;
  };

  getAccount = (user: Object) => {
    return { user };
  };
}
