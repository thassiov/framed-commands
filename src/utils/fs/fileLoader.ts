import { z } from 'zod';

import { promises as fsp } from 'fs';
import { logger } from '../../internal-tools/logger';
import { ParsingError, SystemError } from '../errors';

const pathStringSchema = z.string();

type pathStringType = z.infer<typeof pathStringSchema>;

export async function fileLoader(filePath: pathStringType): Promise<Buffer> {
  if (!pathStringSchema.safeParse(filePath).success) {
    throw new ParsingError('Could not parse file path', { data: filePath });
  }

  try {
    return fsp.readFile(filePath);
  } catch (err) {
    logger.error('Could not read input file', { data: filePath });
    const message = `Could not read input file: ${(err as Error).message}`;
    console.log(message);
    throw new SystemError(message, { data: filePath }, err as Error);
  }
}
