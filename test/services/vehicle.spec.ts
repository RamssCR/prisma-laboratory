import type { VehicleSchema } from '#schemas/vehicle';
import {
  create,
  createMany,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/vehicle';
import { prismaMock } from 'test/prismaMock';
import { describe, expect, test } from 'vitest';

const vehicle = {
  id: 1,
  brandId: 4,
  model: 'Gixxer 250 SF',
  year: 2023,
  displacement: 249,
  createdAt: new Date(),
  updatedAt: new Date(),
  active: true,
};

describe('Vehicle Service', () => {
  test('Debe crear un vehiculo', async () => {
    const mockVehicle = {
      model: 'Gixxer 250 SF',
      year: 2023,
      displacement: 249,
      brandId: 4,
    };
    await create(mockVehicle as unknown as VehicleSchema);

    expect(prismaMock.vehicle.create).toHaveBeenCalledWith({
      data: mockVehicle,
    });
    expect(prismaMock.vehicle.create).toHaveBeenCalledTimes(1);
  });

  test('Debe crear varias marcas', async () => {
    const mockVehicles = [
      {
        model: 'Gixxer 250 SF',
        year: 2023,
        displacement: 249,
        brandId: 4,
      },
      {
        model: 'XTZ 250',
        year: 2023,
        displacement: 249,
        brandId: 4,
      },
    ];

    await createMany(mockVehicles as unknown as VehicleSchema[]);
    expect(prismaMock.vehicle.createMany).toHaveBeenCalledWith({
      data: mockVehicles,
      skipDuplicates: true,
    });
  });

  test('Debe lazar un error si los datos no son un arreglo', async () => {
    const mockData = { model: 'Ducati' };

    const result = await createMany(mockData as unknown as VehicleSchema[]);

    expect(prismaMock.vehicle.createMany).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('Debe devolver varias marcas', async () => {
    const vehicles = [
      {
        id: 1,
        brandId: 4,
        model: 'Gixxer 250 SF',
        year: 2023,
        displacement: 249,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      },
      {
        id: 2,
        brandId: 4,
        model: 'XTZ 250',
        year: 2023,
        displacement: 249,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      },
    ];

    prismaMock.vehicle.findMany.mockResolvedValue(vehicles);
    const result = await findMany();

    expect(prismaMock.vehicle.findMany).toHaveBeenCalledTimes(1);
    expect(vehicles).toEqual(result);
  });

  test('Debe devolver una marca por su id', async () => {
    prismaMock.vehicle.findUnique.mockResolvedValue(vehicle);
    const result = await findUnique(1);
    expect(result).toEqual(vehicle);
    expect(prismaMock.vehicle.findUnique).toHaveBeenCalledTimes(1);
  });

  test('Debe actualizar una marca por su id', async () => {
    prismaMock.vehicle.update.mockResolvedValue(vehicle);
    const result = await update(1, { model: 'YBR 125' });
    expect(prismaMock.vehicle.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(vehicle);
  });

  test('No debe generar slug si el nombre no está presente', async () => {
    const mockData = { active: false };

    await update(1, mockData);

    expect(prismaMock.vehicle.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  test('Debe inactivar una marca por su id', async () => {
    prismaMock.vehicle.update.mockResolvedValue(vehicle);
    await softDelete(1);
    expect(prismaMock.vehicle.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.vehicle.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });
});
