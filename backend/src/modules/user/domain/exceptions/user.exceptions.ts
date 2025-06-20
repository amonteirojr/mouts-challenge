import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.BAD_REQUEST);
  }
}

export class UserValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserValidationException';
  }
} 