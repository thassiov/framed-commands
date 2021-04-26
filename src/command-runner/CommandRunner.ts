import {ICommand} from '../definitions/ICommand';
import {ICommandDescriptor} from '../definitions/ICommandDescriptor';
import {logger} from '../internal-tools/logger';
import { Command } from '../models';

export default class CommandRunner {
  private commands: Array<ICommand> = [];

  constructor(private readonly commandDescriptors: Array<ICommandDescriptor>) {
    this.commandDescriptors.forEach((command: ICommandDescriptor) => {
      this.commands.push(new Command(command));
    })
  }

  public runCommand(id: number): void {
    const command = this.commands[id];

    const io = command.run();

    io.stdout.on('data', (data: Buffer) => {
      logger.info(data.toString());
    });

    io.stderr.on('data', (err: Error) => {
      logger.error(err.toString());
    });

    command.onEvent('exit', () => {
      logger.info(command.getPid());
      logger.info(command.getStatus());
      logger.info(command.getExitCode());
      logger.info(command.getNameAlias());
      logger.info(command.getDescription());
      logger.info(command.getStartDate());
      logger.info(command.getCommandString());
      logger.info(command.getHistoryDump());
    });
  }

  public getCommandList(): Array<{nameAlias: string, description: string}>{
    return this.commandDescriptors
    .map(command => ({nameAlias: command.nameAlias, description: command.description}));
  }

  public getCommandCount(): number {
    return this.commandDescriptors.length;
  }
}
