import { promises as fsp } from 'fs';
import {logger} from './logger';

export async function fileLoader(filePath: string): Promise<Buffer> {
  if (!filePath) {
    throw new Error('No input file provided');
  }

  let fileBuffer;
  try {
    fileBuffer = await fsp.readFile(filePath);
  } catch (fileError) {
    logger.error('Cannot reach input file');
    throw fileError;
  }

  return fileBuffer;
}
