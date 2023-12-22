export class CustomError extends Error {
  details?: Record<string, string>;
  cause?: Error;

  constructor(message: string, details?: Record<string, string>, cause?: Error) {
    super(message);
    this.name = 'CustomError';

    if (details) {
    this.details = details;
    }

    if (cause) {
      this.cause = cause;
    }
  }
}

export class ParsingError extends CustomError {
  name = 'ParsingError';
}

export class ConfigError extends CustomError {
  name = 'ConfigError';
}

export class ValidationError extends CustomError {
  name = 'ValidationError';
}

export class SystemError extends CustomError {
  name = 'SystemError';
}

export class ProcessError extends CustomError {
  name = 'ProcessError';
}

export class NotFoundError extends CustomError {
  name = 'NotFoundError';
}
