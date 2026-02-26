import type { UserSchema } from '#schemas/user';
import type { UserModel } from 'generated/prisma/models';
import {
  create,
  findByEmail,
  findUnique,
  softDelete,
  update,
} from '#services/user';
import { prismaMock } from 'test/prismaMock';
import { describe, expect, test } from 'vitest';

const user = {
  id: 1,
  email: 'alejo@test.com',
  name: 'Alejandro Lopez',
  password: '$2b$10$NzecqFgS69jZ7.57RBXG/u1FfoxEq5Qur.oKojzS58Q4Pk8M5YapK',
  role: 'ADMIN',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('User Service', () => {
  test('Debe crear un usuario', async () => {
    const mockUser = {
      email: 'alejo@test.com',
      name: 'Alejandro Lopez',
      password: '1234560',
      role: 'ADMIN',
    };
    await create(mockUser as unknown as UserSchema);

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { ...mockUser, password: expect.any(String) },
    });
    expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
  });

  test('Debe devolver varios usuarios', async () => {
    const users = [
      {
        email: 'alejo@test.com',
        name: 'Alejandro Lopez',
        password:
          '$2b$10$NzecqFgS69jZ7.57RBXG/u1FfoxEq5Qur.oKojzS58Q4Pk8M5YapK',
        role: 'ADMIN',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'camilo@test.com',
        name: 'Camilo Rodríguez',
        password:
          '$2b$10$NzecqFgS69jZ7.57RBXG/u1FfoxEq5Qur.oKojzS58Q4Pk8M5YapK',
        role: 'USER',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(users as unknown as UserModel[]);
    const result = await prismaMock.user.findMany();
    expect(result).toEqual(users);
  });

  test('Debe devolver un usuario por email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user as unknown as UserModel);
    const result = await findByEmail('alejo@test.com');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'alejo@test.com' },
    });
    expect(result).toEqual(user);
  });

  test('Debe devolver un usuario por id', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user as unknown as UserModel);
    const result = await findUnique(1);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
    expect(result).toEqual(user);
  });

  test('No debe generar slug si el nombre no está presente', async () => {
    const mockData = { name: 'Carlos Zapata' };

    await update('alejo@test.com', mockData);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: 'alejo@test.com' },
      data: { name: 'Carlos Zapata' },
    });
  });

  test('Debe inactivar un usuario por su id', async () => {
    prismaMock.user.update.mockResolvedValue(user as unknown as UserModel);
    await softDelete(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });
});
