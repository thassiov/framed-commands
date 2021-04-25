import { promises as fsp } from 'fs';

export async function fileLoader(filePath: string): Promise<Buffer> {
  if (!filePath) {
    throw new Error('No input file provided');
  }

  let fileBuffer;
  try {
    fileBuffer = await fsp.readFile(filePath);
  } catch (fileError) {
    throw new Error('Cannot reach input file');
  }

  return fileBuffer;
}
