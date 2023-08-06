import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm"
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from 'src/users/dtos/userCreate.dto';
import {Repository} from "typeorm"

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    createUser(userData:CreateUserDto){
        const user= this.userRepository.create(userData)
        return this.userRepository.save(user)
    }
}
