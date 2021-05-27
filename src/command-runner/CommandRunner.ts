import {ICommand} from '../definitions/ICommand';
import {ICommandDescriptor} from '../definitions/ICommandDescriptor';
import {logger} from '../internal-tools/logger';
import { Command } from '../models';

/**
 * Generates a list of `Command`s based on commands descriptors received as
 * argument in its constructor method. The commands can be called by their `id`
 * using the `runCommand` method. The `id` is their index in the list, which
 * is zero indexed.
 */
export default class CommandRunner {
  // The list of commands
  private commands: Array<ICommand> = [];

  constructor(private readonly commandDescriptors: Array<ICommandDescriptor>) {
    this.commandDescriptors.forEach((command: ICommandDescriptor) => {
      this.commands.push(new Command(command));
    });
  }

  /**
   * Executes a given command based on its `id`
   *
   * As the command is run, its stdout and stderr is piped
   * to tuizer's own logger.
   * When the execution exits, the following information is logged:
   * - PID,
   * - status,
   * - exit code,
   * - name alias,
   * - description,
   * - start date,
   * - command string,
   * - history
   *
   * @param id - The index of the given command
   * @returns Promise<void>
   */
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

  /**
   * Lists all the commands registered in the CommandRunner.
   * The list is composed by the command's alias and description
   *
   * @returns An array of objects with properties `nameAlias:string` and `description:string`
   */
  public getCommandList(): Array<{nameAlias: string, description: string}>{
    return this.commandDescriptors
    .map(command => ({nameAlias: command.nameAlias, description: command.description}));
  }

  /**
   * Returns the number of registered commands in the CommandRunner
   *
   * @returns the number of registered commands
   */
  public getCommandCount(): number {
    return this.commandDescriptors.length;
  }
}
