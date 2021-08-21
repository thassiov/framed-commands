import { promises as fsp } from 'fs';
import {logger} from './logger';

export async function fileLoader(filePath: string): Promise<string> {
  if (!filePath) {
    throw new Error('No input file provided');
  }

  try {
    return fsp.readFile(filePath, 'utf8');
  } catch (fileError) {
    logger.error('Could not reach input file');
    throw fileError;
  }
}
