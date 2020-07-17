import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password should have atlease one, uppercase, lowercase and special character',
  }) //one Lower case one upper case one special character
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean = false;
}
