import { spawn } from "child_process";

import { Command } from ".";
import { CommandIOEvent, CommandIONotifier, commandIOEventSchema } from "../../definitions/ICommand";
import { ICommandDescriptor } from '../../definitions/ICommandDescriptor';
import EventEmitter from "events";
import { CommandStatus } from "../../definitions/CommandStatusEnum";
import { mockCommandDescriptor } from "../../utils/tests/commandDescriptor";

jest.mock('child_process');

describe('Command model', () => {

  const mockCommandCenterNotifier = new EventEmitter();

  const mockEventListener = (eventEmitter: EventEmitter) =>
    jest.fn((...args: unknown[]) => {
      const event = args[0] as string;
      const listener = args[args.length - 1] as (...args: unknown[]) => void;
      return eventEmitter.on(event, listener)
    });

  const mockEventEmitter = (eventEmitter: EventEmitter) =>
    jest.fn((...args: unknown[]) => {
      const event = args[0] as string;
      const eventData = args.slice(1);
      return eventEmitter.emit(event, ...eventData);
    });

  beforeAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockCommandCenterNotifier.removeAllListeners();
  });

  it('should create an instance of a command', () => {
    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);

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
    expect(() => new Command(faultyDescriptor as ICommandDescriptor, mockCommandCenterNotifier)).toThrow('Could not create command instance: command descriptor not provided');
  });

  it('should fail by not providing the io notifier necessary to create the command instance', () => {
    expect(() => new Command(mockCommandDescriptor as ICommandDescriptor, {} as CommandIONotifier)).toThrow('Could not create command instance: IO notifier not provided');
  });

  it('should fail by catching a problem with the process spawning mechanism', () => {
    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);
    (spawn as jest.Mock).mockImplementationOnce(() => { throw new Error('something happened in the system'); });

    expect(() => command.run()).toThrow('A problem occurred when running the process');
  });

  it('should run a command', (done) => {
    const childProcessEventEmitterMock = new EventEmitter();

    const childProcessMock = {
      on: mockEventListener(childProcessEventEmitterMock),
      stdout: {
        on: mockEventListener(childProcessEventEmitterMock),
        emit: mockEventEmitter(childProcessEventEmitterMock),
      },
      stderr: { on: mockEventListener(childProcessEventEmitterMock) },
      stdin: { write: jest.fn() },
      pid: 1,
    };

    (spawn as jest.Mock).mockReturnValueOnce(childProcessMock);

    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);
    const commandId = command.getId();

    let expectedIOEvent: CommandIOEvent;
    const eventName = `${commandId}:output`;
    mockCommandCenterNotifier.on(eventName, (payload: CommandIOEvent) => {
      expectedIOEvent = payload;
    });

    command.run();

    childProcessMock.on('exit', () => {
      expect(command.getPid()).toBe(1);
      expect(command.getStatus()).toBe(CommandStatus.FINISHED);
      expect(command.getExitCode()).toBe(0);
      expect(commandIOEventSchema.safeParse(expectedIOEvent).success).toBe(true);
      done();
    });

    childProcessEventEmitterMock.emit('exit', 0, 'SIGCHLD');
  });

  it('should stop a running command', (done) => {
    const childProcessEventEmitterMock = new EventEmitter();

    const childProcessMock = {
      on: mockEventListener(childProcessEventEmitterMock),
      stdout: { on: mockEventListener(childProcessEventEmitterMock) },
      stderr: { on: mockEventListener(childProcessEventEmitterMock) },
      stdin: { write: jest.fn() },
      pid: 1,
      kill: jest.fn((signal: string) => childProcessEventEmitterMock.emit('exit', 0, signal)),
    };

    (spawn as jest.Mock).mockReturnValueOnce(childProcessMock);

    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);

    command.run();

    childProcessMock.on('exit', () => {
      expect(command.getPid()).toBe(1);
      expect(command.getStatus()).toBe(CommandStatus.STOPPED);
      expect(command.getExitCode()).toBe(0);
      done();
    });

    command.stop();
  });

  it('should kill a running command', (done) => {
    const childProcessEventEmitterMock = new EventEmitter();

    const childProcessMock = {
      on: mockEventListener(childProcessEventEmitterMock),
      stdout: { on: mockEventListener(childProcessEventEmitterMock) },
      stderr: { on: mockEventListener(childProcessEventEmitterMock) },
      stdin: { write: jest.fn() },
      pid: 1,
      kill: jest.fn((signal: string) => childProcessEventEmitterMock.emit('exit', 0, signal)),
    };

    (spawn as jest.Mock).mockReturnValueOnce(childProcessMock);

    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);

    command.run();

    childProcessMock.on('exit', () => {
      expect(command.getPid()).toBe(1);
      expect(command.getStatus()).toBe(CommandStatus.STOPPED);
      expect(command.getExitCode()).toBe(0);
      done();
    });

    command.kill();
  });

  it('should send data to a running command via stdin', (done) => {
    const childProcessEventEmitterMock = new EventEmitter();

    let receivedInput = '';
    const childProcessMock = {
      on: mockEventListener(childProcessEventEmitterMock),
      stdout: {
        on: mockEventListener(childProcessEventEmitterMock),
        emit: mockEventEmitter(childProcessEventEmitterMock),
      },
      stderr: { on: mockEventListener(childProcessEventEmitterMock) },
      stdin: { write: jest.fn((data: string) => receivedInput = data) },
      pid: 1,
    };

    (spawn as jest.Mock).mockReturnValueOnce(childProcessMock);

    const command = new Command(mockCommandDescriptor, mockCommandCenterNotifier);
    const commandId = command.getId();

    command.run();

    // send input from command center
    const mockInputData = 'mockInputData';
    const eventName = `${commandId}:input`;
    mockCommandCenterNotifier.emit(eventName, mockInputData);

    childProcessMock.on('exit', () => {
      expect(command.getPid()).toBe(1);
      expect(command.getStatus()).toBe(CommandStatus.FINISHED);
      expect(command.getExitCode()).toBe(0);
      expect(receivedInput).toBe(mockInputData);
      done();
    });

    childProcessEventEmitterMock.emit('exit', 0, 'SIGCHLD');
  });
});
