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

  @IsString()
  public user!: string;
}

export class UserLoginDto {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;
}
