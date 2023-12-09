import { randomBytes } from 'crypto';
import { logger } from '../utils/logger';
import { ValidationError } from './errors';

export function idGenerator(size = 5): string {
  if (size < 5 || size >= 11) {
    logger.error(`Could not generate id as the Size is out of bounds. min: 5, max: 10 chars. given: ${size}`);
    throw new ValidationError('Could not generate id as the Size is out of bounds. min: 5, max: 10 chars', { data: size.toString() });
  }

  const longId = randomBytes(16).toString("hex");

  return longId.substring(0, size);
}

