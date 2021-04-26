import { randomBytes } from 'crypto';
import {logger} from './logger';

export function newId(size = 5): string {
  const longId = randomBytes(16).toString("hex");
  if (size < 5 || size >= 11) {
    logger.warn(`wanted size of id is out of bounds. min: 5, max: 10 chars. given: ${size}`);
    return longId.substring(0, 4);
  }

  return longId.substring(0, size);
}

