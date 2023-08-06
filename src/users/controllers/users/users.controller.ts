import { Controller,Post,Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/userCreate.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}


    @Post("register")
    async createUser(@Body() userData: CreateUserDto){
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.userService.createUser({...userData, createdAt: new Date(), password: hashedPassword})
    }
}
