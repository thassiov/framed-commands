import {CommandStatus} from "./CommandStatusEnum";
import {ICommandIO} from "./ICommandIO";
import {IHistoryEntry} from "./IHistoryEntry";

export interface ICommand {
  run(): ICommandIO;
  stop(): void;
  kill(): void;
  isRunning(): boolean;
  getStatus(): CommandStatus;
  getPid(): number | undefined;
  getExitCode(): number | undefined;
  getStartDate(): Date | undefined;
  getDescription(): string;
  getNameAlias(): string;
  getCommandString(): string;
  onEvent(event: string, listener: () => void): any;
  getHistoryDump(): Array<IHistoryEntry>;
}
