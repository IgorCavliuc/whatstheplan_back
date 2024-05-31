import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { profile, wallpaper } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  decodeRefreshToken(token: string) {
    try {
      const verifyToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return { id: verifyToken.id, email: verifyToken.email };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const decoded = this.jwtService.decode(token) as {
          id: string;
          email: string;
        } | null;
        if (decoded) {
          return { id: decoded.id, email: decoded.email };
        }
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  createRefreshToken(userId: string, email: string): string {
    return this.jwtService.sign({ id: userId, email }, { expiresIn: '7d' });
  }

  createAccessToken(userId: string, email: string): string {
    return this.jwtService.sign({ id: userId, email }, { expiresIn: '15m' });
  }

  async replaceRefreshToken(userId: string, email: string): Promise<string> {
    const newRefreshToken = this.createRefreshToken(userId, email); // Генерируем новый токен обновления

    return newRefreshToken;
  }

  async getUserById(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user)
      throw new UnauthorizedException({
        message: {
          email: 'User not found',
        },
      });

    console.log(user.password, password);

    const passwordIsMatch = await argon2.verify(user.password, password);

    if (!passwordIsMatch)
      throw new UnauthorizedException({
        message: {
          password: 'Invalid password',
        },
      });

    return user;
  }

  async signin(user: { email: string; password: string }) {
    const { email, password } = user;
    const user_data = await this.validateUser(email, password);

    const access_token = this.createAccessToken(user_data.id, user_data.email);
    const { password: _, ...userInfo } = user_data; // Используем _ в качестве переменной для игнорирования свойства password

    return {
      access_token,
      ...userInfo, // Возвращаем только остальные свойства пользователя
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExists) {
      throw new BadRequestException({
        message: {
          email: 'This email is already in use',
        },
      });
    }
    const hashedPassword = await argon2.hash(createUserDto.password);

    const userWithImage = {
      ...createUserDto,
      password: hashedPassword,
      scope: {
        voice: 0,
        value: 0,
      },
      people_data: {
        followersCount: 0,
        followingCount: 0,
        visitorCount: 0,
      },
      contact: {
        phone: '',
        insta: '',
        facebook: '',
        telegram: '',
        viber: '',
        whatsapp: '',
      },
      image: { profile: profile, wallpaper: wallpaper },
    };

    const newUser = this.userRepository.create(userWithImage);

    const savedUser = await this.userRepository.save(newUser);

    const access_token = this.jwtService.sign({
      email: savedUser.email,
      id: savedUser.id,
    });

    return {
      user: { ...savedUser },
      access_token: access_token,
    };
  }
}
