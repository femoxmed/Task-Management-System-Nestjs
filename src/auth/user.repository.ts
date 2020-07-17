import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { loggers } from 'winston';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  //@signup
  async signUp(credentials: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = credentials;

      const salt = await bcrypt.genSalt();
      let hashedPassword = await this.hashPassword(password, salt);
      let userData = this.create({
        username,
        password: hashedPassword,
        salt,
      });
      userData = await userData.save();
      return userData;
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException(error.detail);
      }
    }
  }

  private hashPassword = (password: string, salt: string): Promise<string> => {
    return bcrypt.hash(password, salt);
  };

  async validateUserPassword(credentials: AuthCredentialsDto): Promise<string> {
    try {
      const user = await this.findOne({ username: credentials.username });
      if (user && (await user.validatedPassword(credentials.password))) {
        return user.username;
      } else return null;
    } catch (error) {}
  }
  //@hashPassword
}
