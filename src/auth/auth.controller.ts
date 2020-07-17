import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  Controller,
  Post,
  Body,
  PipeTransform,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() credentials: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(credentials);
  }
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<object> {
    return this.authService.signIn(credentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
