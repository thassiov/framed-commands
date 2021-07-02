/**
 * Gets argument from the command line. This argument should be the path for a file
 */
export function getFilePathFromCliArgs(args: Array<string>): string {
  const usefulStrings = args.slice(2);
  if (usefulStrings.length) {
    return usefulStrings[0] as string;
  }
  return '';
}
