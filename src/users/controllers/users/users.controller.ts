import { Controller,Post,Body, Get, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from 'src/users/dtos/userCreate.dto';
import { userLogin } from 'src/users/dtos/userLogin.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post("register")
    async register(@Body() userData: CreateUserDto){
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.userService.createUser({...userData, createdAt: new Date(), password: hashedPassword})
    }
    @Get("login")
    async login(@Body() userData: userLogin) {
        const {email} = userData
        const user = await this.userService.findOne({email})
        if(!user){
            throw new BadRequestException("invalid credentials")
        }
        if(!await bcrypt.compare(userData.password , user.password)){
            throw new BadRequestException("password is wrong")
        }
        return user
    }
}
