import {ICommandDescriptor} from "./ICommandDescriptor";

export interface IJSONConfigFile {
  commands: Array<ICommandDescriptor>;
  name?: string;
  output?: {
    timestamp?: boolean;
    logfile?: string;
  }
}
