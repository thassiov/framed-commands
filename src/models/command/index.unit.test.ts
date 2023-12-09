import { Readable, Writable } from "stream";
import { spawn } from "child_process";

import { Command } from ".";
import { RunCommandStreams } from "../../definitions/ICommand";
import { ICommandDescriptor } from '../../definitions/ICommandDescriptor';

jest.mock('child_process');

describe('Command model', () => {
  const mockCommandDescriptor: ICommandDescriptor = {
    command: 'node',
    parameters: [
      '-e',
      {
        type: 'string',
        parameter: 'console.log("test command")',
      }
    ],
    description: 'calls the console.log function with a string using the terminal',
    nameAlias: 'print string',
  };

  const mockStreams: RunCommandStreams = {
    writeOutput: new Writable(),
    writeError: new Writable(),
    readInput: new Readable()
  };

  beforeAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should create an instance of a command', () => {
    const command = new Command(mockCommandDescriptor, mockStreams);

    expect(command).toBeInstanceOf(Command);
  });

  it.each([
    [0],
    [undefined],
    [{}],
    [false],
    [{
      parameters: mockCommandDescriptor.parameters
    }],
    [{
      description: mockCommandDescriptor.description
    }]
  ] as unknown[])('should not create an instance of a command by passing invalid data as command descriptor ( %p )', (faultyDescriptor) => {
    expect(() => new Command(faultyDescriptor as ICommandDescriptor, mockStreams)).toThrow('Could not create command instance: command descriptor not provided');
  });

  it('should fail by not providing the io streams necessary create the command instance', async () => {
    expect(() => new Command(mockCommandDescriptor as ICommandDescriptor, {} as RunCommandStreams)).toThrow('Could not create command instance: IO streams not provided');
  });

  it('should fail by catching a problem with the process spawning mechanism', () => {
    const command = new Command(mockCommandDescriptor, mockStreams);
    (spawn as jest.Mock).mockImplementationOnce(() => { throw new Error('something happened in the system'); });

    expect(() => command.run()).toThrow('A problem occurred when running the process');
  });

  it.todo('should run a command');
  it.todo('should stop a running command');
  it.todo('should kill a running running');
  it.todo('should send data to a running command via stdin');
});
