import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits' })
  phone!: string;
}
