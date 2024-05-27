import { Controller, UsePipes,Req, Body, ValidationPipe, UseGuards, Post, Get, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as ExpressResponse, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import {JwtService} from '@nestjs/jwt'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,

  ) {}

  @Post("signup")
  @UsePipes(new ValidationPipe())
  signup(@Body() createAuthDto: CreateUserDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('signin')
  @UsePipes(new ValidationPipe())
   signin(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.signin(authLoginDto)
  }

  @Post('refresh-token')
  async refresh(@Res() res: ExpressResponse, @Req() request: Request) {
    try {
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No refresh token provided' });
      }

      const oldRefreshToken = authorizationHeader.replace('Bearer ', '');

      const tokenData = this.authService.decodeRefreshToken(oldRefreshToken);

      if (tokenData.email && tokenData.id ) {
        const newRefreshToken = await this.authService.replaceRefreshToken(tokenData.id,tokenData.email);

        return res.status(HttpStatus.OK).json({
          message: "Your token expired",
          refresh_access_token: newRefreshToken
        });
      }

      const newRefreshToken = await this.authService.createRefreshToken(tokenData.id,tokenData.email);


      const user = await this.authService.getUserById(tokenData.id); // Получаем пользователя по ID

      return res.status(HttpStatus.OK).json({
        refresh_access_token: newRefreshToken,
        user: user // Возвращаем данные пользователя
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }



  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

}


