import { Controller, Get, Post, Body, UsePipes, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {JwtService} from '@nestjs/jwt'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService,) {}
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
      const {  ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

}

