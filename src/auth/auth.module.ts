import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: jwtConfig.secret }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.secret,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  exports: [JWtStrategy, PassportModule],
  providers: [AuthService, JWtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
