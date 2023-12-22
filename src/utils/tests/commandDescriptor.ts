import { ICommandDescriptor } from "../../definitions/ICommandDescriptor";

export const mockCommandDescriptor: ICommandDescriptor = {
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
