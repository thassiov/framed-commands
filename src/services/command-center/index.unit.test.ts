import EventEmitter from "events";
import CommandCenter, { CommandListItem } from ".";
import { ICommandDescriptor, commandParameterSchema } from "../../definitions/ICommandDescriptor";
import { Command } from "../../models";
import { mockCommandDescriptor } from "../../utils/tests/commandDescriptor";

describe('Command Center', () => {
  const mockCommandIONotifier = new EventEmitter();

  it('create a new cc instance without commands', () => {
    expect(() => new CommandCenter([], mockCommandIONotifier)).not.toThrow();
  });

  it('create a new cc instance with commands', () => {
    expect(() => new CommandCenter([mockCommandDescriptor], mockCommandIONotifier)).not.toThrow();
  });

  it('create a new cc instance with valid commands and ignore invalid commands', () => {
    const { command, ...restOfTheCommand } = mockCommandDescriptor;

    const cc = new CommandCenter([mockCommandDescriptor, restOfTheCommand as ICommandDescriptor], mockCommandIONotifier);
    expect(cc.getCommandCount()).toEqual(1);
  });

  it('count registered commands', () => {
    const cc = new CommandCenter([mockCommandDescriptor], mockCommandIONotifier);
    expect(cc.getCommandCount()).toEqual(1);
  });

  it('list registered commands', () => {
    const cc = new CommandCenter([mockCommandDescriptor], mockCommandIONotifier);
    const commands = cc.getCommandList();
    expect(commands).toBeInstanceOf(Array);
    expect(commands).toHaveLength(1);
    expect(commands[0]).toHaveProperty('alias', mockCommandDescriptor.nameAlias as string);
    expect(commands[0]).toHaveProperty('description', mockCommandDescriptor.description as string);
    expect(commands[0]).toHaveProperty('id');
  });

  it('get command by id', () => {
    const cc = new CommandCenter([mockCommandDescriptor], mockCommandIONotifier);
    const { id: commandId } = cc.getCommandList()[0] as CommandListItem;
    const command = cc.getCommandById(commandId);
    expect(command).toBeInstanceOf(Command);
  });

  it('add a new command to an existing cc', () => {
    const cc = new CommandCenter([], mockCommandIONotifier);
    expect(cc.getCommandCount()).toEqual(0);
    cc.addNewCommand(mockCommandDescriptor);
    expect(cc.getCommandCount()).toEqual(1);
  });

  it('remove a command from an existing cc by its command id', () => {
    const cc = new CommandCenter([], mockCommandIONotifier);
    expect(cc.getCommandCount()).toEqual(0);
    cc.addNewCommand(mockCommandDescriptor);
    cc.addNewCommand(mockCommandDescriptor);
    expect(cc.getCommandCount()).toEqual(2);
    const { id: commandId } = cc.getCommandList()[1] as CommandListItem;

    cc.removeCommandById(commandId);
    expect(cc.getCommandCount()).toEqual(1);
  });

  it('get command parameters', () => {
    const cc = new CommandCenter([mockCommandDescriptor], mockCommandIONotifier);

    const commandId = (cc.getCommandList()[0] as CommandListItem).id;

    const args = cc.getParametersFromCommand(commandId);
    expect(args).toHaveLength(2);
    expect(commandParameterSchema.safeParse(args[0]).success).toBe(true);
    expect(commandParameterSchema.safeParse(args[1]).success).toBe(true);
  });
});
