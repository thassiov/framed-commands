import { UserInfo, userInfo } from 'os';
import { ChildProcess, spawn } from "child_process";
import { ICommand } from '../definitions/ICommand';
import { ICommandDescriptor } from '../definitions/ICommandDescriptor';
import { CommandStatus } from '../definitions/CommandStatusEnum';
// import {Stream} from 'stream';
import {ICommandIO} from '../definitions/ICommandIO';
import {HistoryEntryType, IHistoryEntry} from '../definitions/IHistoryEntry';
import {logger} from '../internal-tools/logger';
import {newId} from '../internal-tools/idGenerator';

export class Command implements ICommand {
  private command: string;
  private parameters: Array<string>;
  private description: string;
  private nameAlias: string;
  private pid: number | undefined;
  private status: CommandStatus;
  private runAs: UserInfo<any>;
  private exitCode: number | undefined;
  private history: Array<IHistoryEntry>;
  private childProcess: ChildProcess;
  // private io: ICommandIO;
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
    // this.io = {
    //   stdin: new Stream.Readable(),
    //   stdout: new Stream.Readable(),
    //   stderr: new Stream.Readable(),
    // }
  }

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

  public stop(): void {
    logger.debug(`Stopping command ${this.nameAlias}`);
    this.childProcess.kill('SIGTERM');
  }

  public kill(): void {
    logger.debug(`Killing command ${this.nameAlias}`);
    this.childProcess.kill('SIGKILL');
  }

  public isRunning(): boolean {
    return this.status == CommandStatus.RUNNING;
  }

  public getStatus(): CommandStatus {
    return this.status;
  }

  public getPid(): number | undefined {
    return this.pid;
  }

  public getExitCode(): number | undefined {
    return this.exitCode;
  }

  public getStartDate(): Date | undefined {
    return this.startDate;
  }

  public getDescription(): string {
    return this.description;
  }

  public getNameAlias(): string {
    return this.nameAlias;
  }

  public getCommandString(): string {
    return this.command + this.parameters.join(' ');
  }

  public onEvent(event: string, listener: () => void): any {
    return this.childProcess.addListener(event, listener);
  }

  public getHistoryDump(): Array<IHistoryEntry> {
    return this.history;
  }

  private eventsListener(): void {
    this.childProcess.on('exit', (code, signal) => {
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

    this.childProcess.on('error', (err) => {
      this.status = CommandStatus.STOPPED;
      // @TODO figure out about this error !== number thing
      // this.exitCode = code;
    logger.error(`Command ${this.nameAlias} stopped: ${err.message}`);
    });
  }

  private registerIoEvent(): void {
    // this.childProcess.stdin.on('pipe', (src) => {
    //   this.history.push({
    //     data: src,
    //     date: new Date(),
    //     type: HistoryEntryType.IN
    //   });
    // });

    this.childProcess.stdout.on('data', (data) => {
      this.history.push({
        data: data.toString(),
        date: new Date(),
        type: HistoryEntryType.OUT
      });
    });

    this.childProcess.stderr.on('data', (data) => {
      this.history.push({
        data: data.toString(),
        date: new Date(),
        type: HistoryEntryType.ERR
      });
    });
  }
}
