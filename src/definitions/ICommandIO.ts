import {Readable, Writable} from "stream";

export interface ICommandIO {
  stdin: Writable | null;
  stdout: Readable | null;
  stderr: Readable | null;
}
