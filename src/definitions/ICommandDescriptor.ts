import { z } from 'zod';

const inputParameterTypeSchema = z.enum(['string']);
export type InputParameterType = z.infer<typeof inputParameterSchema>;

const inputParameterSchema = z.object({
  type: inputParameterTypeSchema,
  parameter: z.string(),
  defaultValue: z.unknown().optional(),
  required: z.boolean().optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
})
export type InputParameter = z.infer<typeof inputParameterSchema>;

export const commandParameterSchema = z.union([z.string(), inputParameterSchema]);
export type CommandParameter = z.infer<typeof commandParameterSchema>;

export const commandDescriptorSchema = z.object({
  command: z.string(),
  parameters: z.array(commandParameterSchema).optional(),
  description: z.string().optional(),
  nameAlias: z.string().optional(),
});
export type ICommandDescriptor = z.infer<typeof commandDescriptorSchema>;
