import User from '../../users/user.entity';

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  isTwoFactorAuthenticationEnabled: false,
  isEmailConfirmed: false,
  isRegisteredWithGoogle: false,
};

export default mockedUser;
