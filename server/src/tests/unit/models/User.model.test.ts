import { User } from '../../../models/User.model';

describe('User Model', () => {
  it('hashes password before save', async () => {
    const user = new User({
      email: 'test@example.com',
      passwordHash: 'plaintext',
      role: 'farmer',
    });

    await user.save();
    
    expect(user.passwordHash).not.toBe('plaintext');
    expect(user.passwordHash.length).toBeGreaterThan(20);
  });

  it('compares password correctly', async () => {
    const user = new User({
      email: 'test@example.com',
      passwordHash: 'password123',
      role: 'farmer',
    });

    await user.save();
    
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});