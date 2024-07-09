import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from '../utils/constands/statusCodes';
import { NotFoundError, ValidationError } from '../utils/errors/customErrors';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: err.message || ReasonPhrases.BAD_REQUEST,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      message: err.message || ReasonPhrases.NOT_FOUND,
    });
  }

  // Handle other types of errors (optional)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
}