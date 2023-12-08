import {UserInfo} from "os";
import {CommandStatus} from "./CommandStatusEnum";
import {CommandParameter} from "./ICommandDescriptor";
import {ICommandIO} from "./ICommandIO";
import {IHistoryEntry} from "./IHistoryEntry";

type ICommandEventAccessor = {
  onEvent(event: string, listener: () => void): any;
  removeAllEventListeners(event?: string): void;
}

type ICommandInfoAccessor = {
  isRunning(): boolean;
  getStatus(): CommandStatus;
  getPid(): number | undefined;
  getParameters(): Array<CommandParameter>;
  setParameters(parameters: Array<CommandParameter>): void ;
  getRunAs(): UserInfo<any>;
  getExitCode(): number | null;
  getStartDate(): Date | undefined;
  getDescription(): string;
  getNameAlias(): string;
  getCommandString(): string;
  onEvent(event: string, listener: () => void): any;
  getHistoryDump(): Array<IHistoryEntry>;
}

type ICommandProcessRunner = {
  run(): ICommandIO;
}

type ICommandProcessStopper = {
  stop(): void;
  kill(): void;
}

type ICommandProcessController = ICommandProcessRunner & ICommandProcessStopper;

export type ICommand = ICommandInfoAccessor
        & ICommandEventAccessor
        & ICommandProcessController;

export type ICommandRemoteControl = ICommandInfoAccessor & ICommandProcessStopper;
