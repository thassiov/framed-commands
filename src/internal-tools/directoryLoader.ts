import { promises as fsp } from 'fs';
import {logger} from './logger';

export async function directoryLoader(dirPath: string): Promise<Array<string>> {
  if (!dirPath) {
    throw new Error('No input directory provided');
  }

  let directoryContent;
  try {
    directoryContent = await fsp.readdir(dirPath);
  } catch (dirError) {
    logger.error('Cannot reach input directory');
    throw dirError;
  }

  return directoryContent;
}

