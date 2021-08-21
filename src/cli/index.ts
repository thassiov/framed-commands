import { normalize, resolve } from "path";

export function getSheetFilePath(args: string[]): string {
  const usefulStrings = args.slice(2);

  if (!usefulStrings.length) {
    throw new Error('No sheet');
  }

  return resolve(normalize(usefulStrings[0] as string));
}
