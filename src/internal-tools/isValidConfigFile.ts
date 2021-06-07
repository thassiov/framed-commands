import { IJSONConfigFile } from "../definitions/IJSONConfigFile";

export function isValidConfigFile(data: any): data is IJSONConfigFile {
  return 'commands' in data;
}
