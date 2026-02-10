import type { SearchQuery } from '#schemas/searchQuery';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/product';
import type { RequestHandler } from 'express';
import status from 'http-status';

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await create(req.body);
    res.status(status.CREATED).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    const products = await findMany(search as SearchQuery['search']);
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await findUnique(Number(id));
    res.json({
      success: true,
      message: 'Product obtained successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await update(Number(id), req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete(Number(id));
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
