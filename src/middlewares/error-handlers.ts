import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import HttpError from '../lib/http-error';

export const notFound = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  next(createError(404, `Not Found - ${request.originalUrl}`));
};

export const errorHandler = (
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  response.status(error.statusCode || 500).json({
    error: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
