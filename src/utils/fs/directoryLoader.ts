import { z } from 'zod';

import { promises as fsp } from 'fs';
import { logger } from '../../internal-tools/logger';
import { ParsingError, SystemError } from '../errors';

const pathStringSchema = z.string();

type pathStringType = z.infer<typeof pathStringSchema>;

export async function directoryLoader(dirPath: pathStringType): Promise<Array<string>> {
  if (!pathStringSchema.safeParse(dirPath).success) {
    throw new ParsingError('Could not parse directory path', { data: dirPath });
  }

  try {
    return fsp.readdir(dirPath);
  } catch (err) {
    logger.error('Could not read input directory', { data: dirPath });
    const message = `Could not read input directory: ${(err as Error).message}`;
    throw new SystemError(message, { data: dirPath }, err as Error);
  }
}
