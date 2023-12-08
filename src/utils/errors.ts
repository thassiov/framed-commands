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
