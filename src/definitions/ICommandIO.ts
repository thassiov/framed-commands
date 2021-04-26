import {Stream} from "stream";

export interface ICommandIO {
  stdin: Stream;
  stdout: Stream;
  stderr: Stream;
}
