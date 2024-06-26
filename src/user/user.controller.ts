import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  //
  // @Post()
  // @UsePipes(new ValidationPipe())
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findOne() {
  //   return this.userService.findOne(userService);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUser(@Request() req) {
    const email = req.user.email;
    const user = await this.userService.getUser(email);
    if (user) {
      const { ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new UnauthorizedException({
      message: {
        email: 'User not found',
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProfile(@Param('id') id: string, @Body() data: any) {
    return this.userService.updateProfile(id, data);
  }
}
