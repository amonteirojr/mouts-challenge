import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundException, UserEmailAlreadyExistsException, UserValidationException } from '../../domain/exceptions/user.exceptions';

@Catch(UserNotFoundException, UserEmailAlreadyExistsException, UserValidationException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (exception instanceof UserNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof UserEmailAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof UserValidationException) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
} 