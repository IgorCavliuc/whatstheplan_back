import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { IUser } from '../types';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  decodeRefreshToken(token: string): { id: string; email: string } | null {
    try {
      const verifyToken = this.jwtService.verify(token);
      return { id: verifyToken.id, email: verifyToken.email };
    } catch (error) {
      console.error('Error decoding token:', error);
      if (error.name === 'TokenExpiredError') {
        return null; // Если токен истек, вернем null
      }
    }
  }

  createRefreshToken(userId: string, email:string ): string {
    return this.jwtService.sign({ id: userId, email }, { expiresIn: '7d' });
  }

  createAccessToken(userId: string, email:string): string {
    return this.jwtService.sign({ id: userId, email }, { expiresIn: '15m' });
  }

  async replaceRefreshToken(userId: string, email:string): Promise<string> {
    const newRefreshToken = this.createRefreshToken(userId, email); // Генерируем новый токен обновления

    return newRefreshToken;
  }

  async getUserById(email: string): Promise<User> {
    return this.userRepository.findOne({
      where:{
        email: email
      }
    })
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) throw new UnauthorizedException({message:{
      email:'User not found'
      }});

    const passwordIsMatch = await argon2.verify(user.password, password);

    if (!passwordIsMatch) throw new UnauthorizedException({message:{
      password:'Invalid password'
      }});

    return user;
  }

  async signin(user: { email: string, password: string }) {
    const { email, password } = user;
    const user_data = await this.validateUser(email, password);

    const access_token = this.createAccessToken(user_data.id, user_data.email);
    const { password: _, ...userInfo } = user_data; // Используем _ в качестве переменной для игнорирования свойства password

    return {
      access_token,
      ...userInfo // Возвращаем только остальные свойства пользователя
    };
  }


  async signup(createUserDto: CreateUserDto) {
    const userHave = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userHave) {
      throw new BadRequestException({
        message: {
          email: 'This email is already in use',
        },
      });
    }
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
      name: createUserDto.name,
      surename: createUserDto.surename,
    });

    const access_token = this.jwtService.sign({ email: createUserDto.email });

    return { user, access_token };
  }


}
