import { CommandIONotifier, ICommand, commandIONotifierSchema } from '../../definitions/ICommand';
import { CommandParameter, ICommandDescriptor, commandDescriptorSchema } from '../../definitions/ICommandDescriptor';
import { Command } from '../../models';
import { logger } from '../../utils/logger';
import { NotFoundError, ValidationError } from '../../utils/errors';

export type CommandListItem = { alias: string, description: string, id: string };

/**
 * Generates a list of `Command`s based on commands descriptors received as
 * argument in its constructor method. The commands can be called by their `id`
 * using the `runCommand` method. The `id` is their index in the list, which
 * is zero indexed.
 */
export default class CommandCenter {
  // The list of commands
  private commands: Array<ICommand> = [];

  // The list of command descriptors
  private commandDescriptors: ICommandDescriptor[];

  // event emitter used to receive and send data to commands
  private commandIONotifier: CommandIONotifier;

  constructor(commandDescriptors: ICommandDescriptor[] = [], commandIONotifier: CommandIONotifier) {
    this.commandDescriptors = commandDescriptors;

    if (!commandIONotifierSchema.safeParse(commandIONotifier).success) {
      logger.error('Could not create instance of Command Center: commandIONotifier provided is invalid or missing');
      throw new ValidationError('Could not create instance of Command Center: commandIONotifier provided is invalid or missing');
    }

    this.commandIONotifier = commandIONotifier;

    this.commandDescriptors.forEach((commandDescriptor: ICommandDescriptor) => {
      this.addNewCommand(commandDescriptor);
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
  public runCommand(commandId: string): void {
    try {
      const command = this.getCommandById(commandId);
      command.run();
    } catch (error) {
      logger.error(`Could not run command ${commandId}: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Lists all the commands registered in the CommandRunner.
   * The list is composed by the command's alias and description
   *
   * @returns An array of command descriptors
   */
  public getCommandList(): CommandListItem[]{
    return this.commands.map((command: ICommand) => ({
      alias: command.getNameAlias(),
      description: command.getDescription(),
      id: command.getId(),
    }));
  }

  public getCommandById(commandId: string): ICommand {
    const command = this.commands.find((command: ICommand) => command.getId() === commandId);

    if(!command) {
      logger.error(`Command id ${commandId} does not exists`);
      throw new NotFoundError(`Command id ${commandId} does not exists`, { data: commandId });
    }

    return command;
  }

  /**
   * Returns the number of registered commands in the CommandRunner
   *
   * @returns the number of registered commands
   */
  public getCommandCount(): number {
    return this.commands.length;
  }

  /**
   * Returns the parameters from a given command
   *
   * @returns The command's parameters (Array<CommandParameter>)
   */
  public getParametersFromCommand(commandId: string): CommandParameter[] {
    try {
      const command = this.getCommandById(commandId);
      return command.getParameters();
    } catch (error) {
      logger.error(`Could not get command's parameters: ${(error as Error).message}`, { data: commandId })
      throw error;
    }
  }

  /**
   * Sets' new parameters in a given command
   *
   * @param commandId string
   * @param parameters Array<CommandParameter>
   *
   * @returns void
   */
  public setParametersFromCommand(commandId: string, parameters: CommandParameter[]): void {
    try {
      const command = this.getCommandById(commandId);
      return command.setParameters(parameters);
    } catch (error) {
      logger.error(`Could not get command's parameters: ${(error as Error).message}`, { data: commandId })
      throw error;
    }

    ;
  }

  public addNewCommand(commandDescriptor: ICommandDescriptor): boolean {
    if (!commandDescriptorSchema.safeParse(commandDescriptor).success) {
      logger.warn('Could not instantiate command:', commandDescriptor);
      return false;
    }

    this.commands.push(new Command(commandDescriptor, this.commandIONotifier));

    return true;
  }

  public removeCommandById(commandId: string): boolean {
    if (!commandId) {
      return false;
    }

    const idx = this.getCommandList().findIndex((command: CommandListItem) => command.id === commandId);

    if (idx === -1) {
      return false;
    }

    // @TODO remove listeners from this command
    this.commands.splice(idx, 1);

    return true;
  }
}
