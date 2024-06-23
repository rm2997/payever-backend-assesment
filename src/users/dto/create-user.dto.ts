import {
  IsEmail,
  IsNotEmpty,
  IsString,
  isString,
} from '@nestjs/class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  avatar?: string;
}
