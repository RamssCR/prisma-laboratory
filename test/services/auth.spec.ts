import { describe, expect, vi, test } from "vitest";
import * as userService  from '#services/user';
import * as bcryptLib from '#libs/bcrypt';
import * as jwtLib from '#libs/jwt';
import { login } from "#services/auth";
import type { UserSchema } from "#schemas/user";

describe('Auth Service', () => {
describe('login', () => {
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
    } as unknown as UserSchema;

    const loginData: UserSchema = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    } as unknown as UserSchema;

    test('should throw error if user is not found', async () => {
        vi.spyOn(userService, 'findByEmail').mockResolvedValue(null);

        await expect(login(loginData)).rejects.toThrow('Invalid email or password');
    });

    test('should throw error if password does not match', async () => {
        vi.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
        vi.spyOn(bcryptLib, 'compareValue').mockResolvedValue(false);

        await expect(login(loginData)).rejects.toThrow('Invalid email or password');
    });

    test('should return user and tokens on successful login', async () => {
        vi.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
        vi.spyOn(bcryptLib, 'compareValue').mockResolvedValue(true);
        const tokens = { id: 1 };
        vi.spyOn(jwtLib, 'createToken').mockResolvedValue(tokens, 'access', { expiresIn: '1h' } as unknown as SignOptions);

        const auth = await import('#services/auth');
        vi.spyOn(auth, 'generateTokens').mockResolvedValue(tokens, 'access', { expiresIn: '1h' } as unknown as SignOptions);

        const result = await login(loginData);

        expect(result.user).toEqual(mockUser);
        expect(result.tokens).toEqual(tokens);
    });
});
})
