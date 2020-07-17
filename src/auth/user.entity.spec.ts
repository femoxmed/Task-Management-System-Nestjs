import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
let user;
describe('User Entity', () => {
  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    bcrypt.compare = jest.fn();
  });
  describe('validatePassword', () => {
    it('returns true if password is valid', async () => {
      bcrypt.compare.mockReturnValue(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatedPassword('12345');
      expect(bcrypt.compare).toHaveBeenCalledWith('12345', user.password);
      expect(result).toEqual(true);
    });

    it('returns false if password is invalid', async () => {
      bcrypt.compare.mockReturnValue(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatedPassword('12345');
      expect(bcrypt.compare).toHaveBeenCalledWith('12345', user.password);
      expect(result).toEqual(false);
    });
    // it('returns false if password is invalid', () => {});
  });
});
