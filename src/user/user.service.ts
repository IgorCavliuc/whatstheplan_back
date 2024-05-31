import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
    });

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async updateProfile(profile_id: string, data: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: profile_id },
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (data.contact) {
        user.contact = { ...user.contact, ...data.contact };
      }

      Object.assign(user, data);

      const updatedUser = await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = updatedUser;
      return {
        success: true,
        message: 'Successfully updated profile',
        user: userWithoutPassword,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: err.message,
      };
    }
  }
}
