import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { Task } from './../tasks/task.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp = async (credentials: AuthCredentialsDto): Promise<User> => {
    return this.userepository.signUp(credentials);
  };

  signIn = async (credentials: AuthCredentialsDto): Promise<object> => {
    const username = await this.userepository.validateUserPassword(credentials);
    if (!username) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { username };
    let accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  };
}
