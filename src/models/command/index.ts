import { UserInfo, userInfo } from 'os';
import { ChildProcess, spawn } from "child_process";
import { ICommand, CommandIOEvent, CommandIONotifier, commandIONotifierSchema, CommandEventNames } from '../../definitions/ICommand';
import { commandDescriptorSchema, CommandParameter, ICommandDescriptor } from '../../definitions/ICommandDescriptor';
import { CommandStatus } from '../../definitions/CommandStatusEnum';
import { logger } from '../../utils/logger';
import { idGenerator } from '../../utils/idGenerator';
import { ProcessError, ValidationError } from '../../utils/errors';
import { randomUUID } from 'crypto';

/**
 * The command is instantiated by providing the command's descriptor object
 * to the contructor method.
 */
export class Command implements ICommand {
  // The command identifier (uuid/v4)
  private id: string;

  // The command string
  private command: string;

  // The parameters given to the command
  private parameters: Array<CommandParameter>;

  // The command's description
  private description: string;

  // The alias given to the command
  private nameAlias: string;

  // The command process's PID
  private pid?: number;

  // The command's current status
  private status: CommandStatus;

  // The user running the command
  private runAs: UserInfo<unknown>;

  // The command's exit code
  private exitCode?: number;

  // Signal sent by the OS
  private signal?: NodeJS.Signals;

  // The instance of the command's process
  private childProcess?: ChildProcess;

  // The datetime when the command was run (not instantiated)
  private startDate?: Date;

  // The event emitter used for communication with the process
  private notifier: CommandIONotifier;

  private eventNames: CommandEventNames;

  constructor(private readonly commandDescriptor: ICommandDescriptor, notifier: CommandIONotifier) {
    if (!commandDescriptorSchema.safeParse(commandDescriptor).success) {
      logger.error('Cound not create command instance: command descriptor not provided', { data: JSON.stringify(commandDescriptor) });
      throw new ValidationError('Could not create command instance: command descriptor not provided', { data: JSON.stringify(commandDescriptor) });
    }

    if (!commandIONotifierSchema.safeParse(notifier).success) {
      logger.error('Could not create command instance: IO notifier not provided', { data: notifier.toString() });
      throw new ValidationError('Could not create command instance: IO notifier not provided', { data: notifier.toString() });
    }

    this.id = randomUUID();
    this.notifier = notifier;
    this.eventNames = {
      output: `${this.id}:output`,
      input: `${this.id}:input`,
    };
    // @TODO decide wheter to use randomUUID or idGenerator, or even make idGenerator use randomUUID
    this.nameAlias = this.commandDescriptor.nameAlias || idGenerator();
    logger.debug(`Creating command ${this.nameAlias}`);
    this.description = this.commandDescriptor.description || '';
    this.command = this.commandDescriptor.command;
    this.parameters = this.commandDescriptor.parameters || [];
    this.runAs = userInfo();
    this.status = CommandStatus.NOT_STARTED;
  }

  /**
   * Executes the command
   */
  public run(): void {
    const resolvedParameters = this.resolveCommandParameters(this.parameters);

    logger.debug(`Running command: ${ this.command } ${ resolvedParameters.join(' ') }`);

    this.startDate = new Date();

    try {
      this.childProcess = spawn(this.command, resolvedParameters, {
        cwd: process.cwd(),
        uid: this.runAs.uid,
        gid: this.runAs.gid,
      });

      this.pid = this.childProcess.pid;
      this.status = CommandStatus.RUNNING;

      this.setLifecycleEventListeners();
      this.setIOEmitters();
      this.setIOListeners();
    } catch (err) {
      logger.error('A problem occurred when running the process', { data: { pid: this.pid, command: this.command } });
      throw new ProcessError('A problem occurred when running the process', { data: { pid: this.pid, command: this.command }.toString() }, err as Error);
    }
  }

  /**
   * Calls SIGTERM to terminate the process
   *
   * @returns void
   */
  public stop(): void {
    logger.debug(`Stopping command ${this.nameAlias}`);
    this.childProcess?.kill('SIGTERM');
  }

  /**
   * Calls SIGKILL to terminate the process
   *
   * @returns void
   */
  public kill(): void {
    logger.debug(`Killing command ${this.nameAlias}`);
    this.childProcess?.kill('SIGKILL');
  }

  /**
   * For checking whether the process is running
   *
   * @returns boolean
   */
  public isRunning(): boolean {
    return this.status == CommandStatus.RUNNING;
  }

  /**
   * Returns the current status of the process
   *
   * @returns `CommandStatus`
   */
  public getStatus(): CommandStatus {
    return this.status;
  }

  /**
   * Returns the command's parameters
   *
   * @returns Array<CommandParameter>
   */
  public getParameters(): Array<CommandParameter> {
    return this.parameters;
  }

  /**
   * Set the command's parameters
   *
   * This is used when the user answers parameters questions
   * All the parameters are reset in the prop
   *
   * @param parameters - Array<CommandParameter>
   * @returns void
   */
  public setParameters(parameters: Array<CommandParameter>): void {
    this.parameters = parameters;
  }

  /**
   * Returns the PID of the process
   *
   * @returns a number representing the PID or undefined if the process
   * didn't started yet
   */
  public getPid(): number | undefined {
    return this.pid;
  }

  /**
   * Returns the ID of the process
   *
   * @returns a UUID representing the command
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Returns the user running the command's process
   *
   * @returns UserInfo object
   */
  public getRunAs(): UserInfo<unknown> {
    return this.runAs;
  }

  /**
   * Returns the process exit code
   *
   * @returns the exit code's number or undefined, if not present
   */
  public getExitCode(): number | undefined {
    return this.exitCode;
  }

  /**
   * Returns the datetime of when the process _started_ (not when it got instantiated)
   *
   * @returns Date object
   */
  public getStartDate(): Date | undefined {
    return this.startDate;
  }

  /**
   * Gets the command's description
   *
   * @returns string
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * Returns the alias given to the command
   *
   * @returns string
   */
  public getNameAlias(): string {
    return this.nameAlias;
  }

  /**
   * Gets the string that composes the command
   *
   * @returns string
   */
  public getCommandString(): string {
    return this.command + this.parameters.join(' ');
  }

  /**
   * Makes sure the command receives the parameters that need user input
   *
   * In the list of parameters, there may be some 'input objects' among the strings
   * This method makes sure those are 'resolved'
   *
   * @returns Array<string>
   */
  private resolveCommandParameters(params: Array<CommandParameter>): Array<string> {
    return params.map((param) => {
      if (typeof param == 'string' ) {
        return param;
      }

      // gets the first '$' that is not escaped
      const replaceRule = new RegExp(/(?<!\\)\$/);

      // @TODO test to see if the answer is provided

      if (param.parameter.match(replaceRule)) {
        return param.parameter.replace(replaceRule, param.answer as string);
      }

      return param.answer as string;
    });
  }

  /**
   * Handles the process's status based on signals emmited by the process
   *
   * @returns void
   */
  private setLifecycleEventListeners(): void {
    this.childProcess?.on('exit', (code, signal) => {
      const now = new Date();
      switch (signal) {
        case 'SIGKILL':
        case 'SIGTERM':
        case 'SIGQUIT':
          this.status = CommandStatus.STOPPED;
          break;
        default:
          if (code && code > 0) {
            this.status = CommandStatus.ERROR;
          } else {
            this.status = CommandStatus.FINISHED;
          }
          break;
      }

      this.signal = signal as NodeJS.Signals;
      this.exitCode = !Object.is(code, null) ? code as number : -1;

      const endProcessEvent: CommandIOEvent = {
        id: randomUUID(),
        commandId: this.id,
        type: 'processEnd',
        date: now,
        payload: {
          status: this.status,
          signal: this.signal,
          code: this.exitCode.toString() ,
        }
      };

      this.notifyIOEvent(endProcessEvent)
      logger.debug(`Command "${this.nameAlias}" is exiting ${signal ? 'by signal' + signal : '' } with code ${code}`);
    });

    this.childProcess?.on('error', (err: Error) => {
      const now = new Date();
      this.status = CommandStatus.STOPPED;

      const processErrorPayload: CommandIOEvent = {
        id: randomUUID(),
        commandId: this.id,
        type: 'processError',
        date: now,
        payload: err
      }

      this.notifyIOEvent(processErrorPayload)
      logger.error(`Command ${this.nameAlias} got an error: ${err.message}`);
    });
  }

  /**
   * Registers events in the process's history
   *
   * @returns void
   */
  private setIOEmitters(): void {
    this.childProcess?.stdout?.on('data', (data: Buffer) => {
      const now = new Date();
      const outputString = data.toString();
      const outputEvent: CommandIOEvent = {
        id: randomUUID(),
        commandId: this.id,
        type: 'output',
        date: now,
        payload: outputString,
      };

      this.notifyIOEvent(outputEvent)
    });

    this.childProcess?.stderr?.on('data', (data: Buffer) => {
      const now = new Date();
      const errorString = data.toString();
      const errorEvent: CommandIOEvent = {
        id: randomUUID(),
        commandId: this.id,
        type: 'error',
        date: now,
        payload: errorString,
      };

      this.notifyIOEvent(errorEvent)
    });
  }

  /**
   * Registers listeners to receive communication from the command center
   * into the running process
   *
   * @returns void
   */
  private setIOListeners(): void {
    // @NOTE i don't know if this will work without adding <Enter> by default at the end of the data
    this.notifier.on(this.eventNames.input, this.inputEventListener.bind(this));
  }

  /**
   * Sends data out to the listener of the command (command center)
   *
   * @returns void
   */
  private notifyIOEvent(event: CommandIOEvent): void {
    logger.debug(`Command ${this.getId()} sending notification of type ${event.type}`);
    this.notifier.emit(this.eventNames.output, event);
  }

  private inputEventListener(data: string): void {
    this.childProcess?.stdin?.write(data);
  }

  /**
   * Used when deleting the command from the command center
   * This removes the listener so we don't have 'dangling' ones
   * after command removal
   *
   * @returns void
   */
  public detachEventNotifier() {
    this.notifier.removeListener(this.eventNames.input, this.inputEventListener);
  }

  public getEventNames(): CommandEventNames {
    return this.eventNames;
  }
}
