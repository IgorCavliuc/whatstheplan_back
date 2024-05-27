import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {User} from './entities/user.entity';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}


  // findAll() {
  //   return `This action returns all user`;
  // }

  async getUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'surename'], // Укажите все поля, кроме password
    });
    return user;
  }

   async findOne(email: string) {
    return  await this.userRepository.findOne({
      where:{
        email: email
      }
    })
  }
}
