import { IsEmail, MinLength } from 'class-validator'


export class AuthLoginDto {

  @IsEmail()
  email: string;

  @MinLength(6, {message:"Password must be at least 6 characters"})
  password: string;
}
