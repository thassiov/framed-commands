import {ICommandDescriptor} from "./ICommandDescriptor";

export interface IJSONConfigFile {
  commands: Array<ICommandDescriptor>;
  output?: {
    timestamp?: boolean;
    logfile?: string;
  }
};

