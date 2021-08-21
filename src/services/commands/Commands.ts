import { Readable } from 'stream';
import { ICommand } from '../../definitions/ICommand';
import { CommandParameter, ICommandDescriptor } from '../../definitions/ICommandDescriptor';
import { Command } from '../../models';

export interface IOutput {
  stdout: Readable;
  stderr: Readable;
}

/**
 * Generates a list of `Command`s based on commands descriptors received as
 * argument in its constructor method. The commands can be called by their `id`
 * using the `runCommand` method. The `id` is their index in the list, which
 * is zero indexed.
 */
export default class CommandsService {
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
   * to run-the-sheet's own logger.
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
  public runCommand(id: number): IOutput {
    const command = this.commands[id];

    if(!command) {
      throw new Error(`Command id ${id} does not exists`);
    }

    const io = command.run();

    return {
      stdout: io.stdout as Readable,
      stderr: io.stderr as Readable,
    };
  }

  /**
   * Lists all the commands registered in the CommandRunner.
   * The list is composed by the command's alias and description
   *
   * @returns An array of command descriptors
   */
  public getCommandList(): Array<ICommandDescriptor>{
    return this.commandDescriptors;
  }

  public getCommandById(commandId: number): ICommand {
    const command = this.commands[commandId];

    if(!command) {
      throw new Error(`Command id ${commandId} does not exists`);
    }

    return command;
  }

  /**
   * Returns the number of registered commands in the CommandRunner
   *
   * @returns the number of registered commands
   */
  public getCommandCount(): number {
    return this.commandDescriptors.length;
  }

  /**
   * Returns the parameters from a given command
   *
   * @returns The command's parameters (Array<CommandParameter>)
   */
  public getParametersFromCommand(commandId: number): Array<CommandParameter> {
    if(!this.commands[commandId]) {
      throw new Error('Command does not exist');
    }

    return (this.commands[commandId] as ICommand).getParameters();
  }

  /**
   * Sets' new parameters in a given command
   *
   * @param commandId number
   * @param parameters Array<CommandParameter>
   *
   * @returns void
   */
  public setParametersFromCommand(commandId: number, parameters: Array<CommandParameter>): void {
    if(!this.commands[commandId]) {
      throw new Error('Command does not exist');
    }

    (this.commands[commandId] as ICommand).setParameters(parameters);
  }

  public listenToCommandEvent(commandId: number, event: string, eventHandler: () => void): void {
    const command = this.commands[commandId];

    if(!command) {
      throw new Error('Command does not exist');
    }

    command.onEvent(event, eventHandler);
  }

  public stopListeningtoCommandEvents(commandId: number): void {
    if(!this.commands[commandId]) {
      throw new Error('Command does not exist');
    }

    this.commands[commandId]?.removeAllEventListeners();
  }
}
