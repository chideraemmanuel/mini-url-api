import { NextFunction, Request, Response } from 'express';
import HttpError from '../lib/http-error';

export const notFound = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  throw new HttpError(`Not Found - ${request.originalUrl}`, 404);
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
