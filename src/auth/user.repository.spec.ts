import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TaskRespository } from './../tasks/task.respository';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
// let mockCredentials = { username: 'mendo', password: 'mendo' };
const mockCredentials = {
  username: 'mendo',
  password: 'testPassword',
  isAdmin: true,
};
describe('User Repository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(async () => {
      save = jest.fn();

      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue('mendo');

      userRepository.create = jest
        .fn()
        .mockResolvedValue({ ...mockCredentials, save });
    });

    it('succesfully signs up the user', () => {
      save.mockResolvedValue(mockCredentials);
      expect(userRepository.signUp(mockCredentials)).resolves.not.toThrow();
    });

    it('throws Conflict Error', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentials)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('throws internaServer error', () => {
      save.mockRejectedValue({ code: '23506' });
      expect(userRepository.signUp(mockCredentials)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'mendo';
      user.validatedPassword = jest.fn();
    });
    it('returns username if password is validated', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      userRepository.findOne.mockResolvedValue(user);
      user.validatedPassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockCredentials);
      expect(result).toEqual('mendo');
    });

    // it('returns null as user is not be found', () => {});

    // it('returns null if password invalid', () => {});
  });

  describe('hashPassword', () => {
    it('calls bcrpt.hash to genreate hash', async () => {
      bcrypt.hash = jest.fn();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
    });
  });
});
