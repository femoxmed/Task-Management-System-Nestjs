import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { JWtStrategy } from './jwt.strategy';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jWtStrategy: JWtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JWtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jWtStrategy = await module.get<JWtStrategy>(JWtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  //validate
  describe('validate', () => {
    it('validates and returns the user based on jwt patyload', async () => {
      const user = new User();
      user.username = 'TestUser';

      userRepository.findOne.mockResolvedValue({ username: 'TestUser' });
      const result = await jWtStrategy.validate(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      });
    });
  });
});
