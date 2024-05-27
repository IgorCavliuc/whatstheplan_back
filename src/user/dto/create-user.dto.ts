import { IsEmail,IsString, ValidateNested, MinLength } from 'class-validator'

export class CreateUserDto {

  @IsEmail()
  email: string;

  @MinLength(6, {message:"Password must be at least 6 characters"})
  password: string;

  @IsString()
  name: string;

  @IsString()
  surename: string;
}
