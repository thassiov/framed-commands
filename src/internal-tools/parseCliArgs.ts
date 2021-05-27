/**
 * Gets argument from the command line. This argument should be the path for a file
 */
export function processCliArgs(args: Array<string>): Array<string> {
  return args.slice(2);
}
