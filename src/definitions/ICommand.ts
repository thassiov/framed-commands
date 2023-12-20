import {UserInfo} from "os";
import { z } from "zod";
import {CommandStatus} from "./CommandStatusEnum";
import {CommandParameter} from "./ICommandDescriptor";
import EventEmitter from "events";

export const commandIOEventSchemaTypes = ['input','output', 'processOutput', 'error', 'processError', 'processEnd'] as const;

export const commandIOEventSchema = z.object({
  id: z.string(),
  commandId: z.string(),
  type: z.enum(commandIOEventSchemaTypes),
  date: z.coerce.date(),
  payload: z.union([z.record(z.string()), z.string(), z.custom<Error>()]).optional(),
});

export type CommandIOEvent = z.infer<typeof commandIOEventSchema>;

export const commandIONotifierSchema = z.instanceof(EventEmitter);

export type CommandIONotifier = z.infer<typeof commandIONotifierSchema>;

export const commandIONotifierFactorySchema = z.function().args(z.string()).returns(commandIONotifierSchema);

export type CommandIONotifierFactory = z.infer<typeof commandIONotifierFactorySchema>;

type ICommandInfoAccessor = {
  isRunning(): boolean;
  getStatus(): CommandStatus;
  getPid(): number | undefined;
  getId(): string;
  getParameters(): Array<CommandParameter>;
  setParameters(parameters: Array<CommandParameter>): void ;
  getRunAs(): UserInfo<unknown>;
  getExitCode(): number | undefined;
  getStartDate(): Date | undefined;
  getDescription(): string;
  getNameAlias(): string;
  getCommandString(): string;
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
        & ICommandProcessController;

export type ICommandRemoteControl = ICommandInfoAccessor & ICommandProcessStopper;
