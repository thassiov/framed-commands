import {UserInfo} from "os";
import { Readable, Writable } from "stream";
import { z } from "zod";
import {CommandStatus} from "./CommandStatusEnum";
import {CommandParameter} from "./ICommandDescriptor";
import {IHistoryEntry} from "./IHistoryEntry";

export const runCommandArgsSchema = z.object({
  writeOutput: z.instanceof(Writable),
  writeError: z.instanceof(Writable),
  readInput: z.instanceof(Readable),
});

export type RunCommandStreams = z.infer<typeof runCommandArgsSchema>;


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
  run(): void;
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
