import { UserInfo, userInfo } from 'os';
import { ChildProcess, spawn } from "child_process";
import { ICommand } from '../definitions/ICommand';
import { ICommandDescriptor } from '../definitions/ICommandDescriptor';
import { CommandStatus } from '../definitions/CommandStatusEnum';
import { ICommandIO } from '../definitions/ICommandIO';
import { HistoryEntryType, IHistoryEntry } from '../definitions/IHistoryEntry';
import { logger } from '../internal-tools/logger';
import { newId } from '../internal-tools/idGenerator';

/**
 * The command is instantiated by providing the command's descriptor object
 * to the contructor method.
 */
export class Command implements ICommand {
  // The command string
  private command: string;

  // The parameters given to the command
  private parameters: Array<string>;

  // The command's description
  private description: string;

  // The alias given to the command
  private nameAlias: string;

  // The command process's PID
  private pid: number | undefined;

  // The command's current status
  private status: CommandStatus;

  // The user running the command
  private runAs: UserInfo<any>;

  // The command's exit code
  private exitCode: number | null;

  // The list of events emmited by the command's process
  private history: Array<IHistoryEntry>;

  // The instance of the command's process
  private childProcess: ChildProcess | null;

  // The datetime when the command was run (not instantiated)
  private startDate: Date | undefined;

  constructor(private readonly commandDescriptor: ICommandDescriptor) {
    this.nameAlias = this.commandDescriptor.nameAlias || newId();
    logger.debug(`Creating command ${this.nameAlias}`);
    this.description = this.commandDescriptor.description;
    this.command = this.commandDescriptor.command;
    this.parameters = this.commandDescriptor.parameters;
    this.runAs = userInfo();
    this.status = CommandStatus.NOT_STARTED;
    this.history = [];
    this.childProcess = null;
    this.exitCode = null;
  }

  /**
   * Executes the command
   *
   * @return an object containing the process's stdin, stdout and stderr streams
   */
  public run(): ICommandIO {
    logger.debug(`Running command ${this.nameAlias}`);
    this.childProcess = spawn(this.command, this.parameters, {
      uid: this.runAs.uid,
      gid: this.runAs.gid,
      stdio:[
        'pipe',
        'pipe',
        'pipe'
      ]
    });

    this.startDate = new Date();
    this.pid = this.childProcess.pid;
    this.status = CommandStatus.RUNNING;

    this.eventsListener();
    this.registerIoEvent();

    return {
      stdin: this.childProcess.stdin,
      stdout: this.childProcess.stdout,
      stderr: this.childProcess.stderr,
    };
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
   * Returns the PID of the process
   *
   * @returns a number representing the PID or undefined if the process
   * didn't started yet
   */
  public getPid(): number | undefined {
    return this.pid;
  }

  /**
   * Returns the process exit code
   *
   * @returns the exit code's number or null, if not present
   */
  public getExitCode(): number | null {
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
   * Provides a way to register a event listener for the process
   *
   * @returns any
   */
  public onEvent(event: string, listener: () => void): any {
    return this.childProcess?.addListener(event, listener);
  }

  /**
   * Gets the process' history data
   *
   * @returns an array of IHistoryEntry
   */
  public getHistoryDump(): Array<IHistoryEntry> {
    return this.history;
  }

  /**
   * Handles the process's status based on signals emmited by the process
   *
   * @returns void
   */
  private eventsListener(): void {
    this.childProcess?.on('exit', (code, signal) => {
      switch (signal) {
        case 'SIGKILL':
          this.status = CommandStatus.KILLED;
          break;
        case 'SIGTERM':
          this.status = CommandStatus.STOPPED;
          break;
        default:
          this.status = CommandStatus.FINISHED;
          break;
      }

      this.exitCode = code;
      logger.debug(`Command ${this.nameAlias} is exiting ${signal ? 'by signal' + signal : '' } with code ${code}`);
    });

    this.childProcess?.on('error', (err) => {
      this.status = CommandStatus.STOPPED;
      // @TODO figure out about this error !== number thing
      // this.exitCode = code;
    logger.error(`Command ${this.nameAlias} stopped: ${err.message}`);
    });
  }

  /**
   * Registers events in the process's history
   *
   * @returns void
   */
  private registerIoEvent(): void {
    this.childProcess?.stdout?.on('data', (data) => {
      this.history.push({
        data: data.toString(),
        date: new Date(),
        type: HistoryEntryType.OUT
      });
    });

    this.childProcess?.stderr?.on('data', (data) => {
      this.history.push({
        data: data.toString(),
        date: new Date(),
        type: HistoryEntryType.ERR
      });
    });
  }
}
