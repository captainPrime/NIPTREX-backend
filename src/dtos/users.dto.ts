/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-_.@]+$/)
  @MinLength(3)
  @MaxLength(32)
  public first_name!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-_.@]+$/)
  @MinLength(3)
  @MaxLength(32)
  public last_name!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  public phone_number?: string;

  @IsOptional()
  @IsString()
  public profile_picture?: string;

  @IsString()
  public user!: string;

  @IsString()
  public country!: string;
}

export class UserLoginDto {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  public password!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  public confirm_password!: string;
}
