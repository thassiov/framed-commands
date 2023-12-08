enum InputTypes {
  STRING="string"
}

export type InputParameter = {
  type: InputTypes,
  parameter: string,
  defaultValue?: unknown,
  required?: boolean,
  question?: string,
  answer?: string,
}

export type CommandParameter = string | InputParameter;

export type ICommandDescriptor = {
  command: string;
  parameters: Array<CommandParameter>;
  description: string;
  nameAlias: string;
}
