/*type PrismaDelegateSoftDelete = {
  update(args: { where: unknown; data: { active: false } }): unknown;
};

export const deleteService = <T extends PrismaDelegateSoftDelete>(
  model: T,
  args: Parameters<T['update']>[0],
) => {
  return model.update({
    ...args,
    data: {
      ...args.data,
      active: false,
    },
  });
};*/
