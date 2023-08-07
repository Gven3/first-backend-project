import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/userCreate.dto';
import { userLogin } from 'src/users/dtos/userLogin.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userService.createUser({
      ...userData,
      createdAt: new Date(),
      password: hashedPassword,
    });
  }
  @Post('login')
  async login(
    @Body() userData: userLogin,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne(userData.email);
    if (!user) {
      throw new BadRequestException('email is wrong');
    }
    if (!(await bcrypt.compare(userData.password, user.password))) {
      throw new BadRequestException('password is wrong');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    const { password, ...result } = user;
    return result;
  }
}
