import { z } from 'zod';

const inputParameterTypeSchema = z.enum(['string']);
export type InputParameterType = z.infer<typeof inputParameterSchema>;

const inputParameterSchema = z.object({
  type: inputParameterTypeSchema,
  parameter: z.string(),
  defaultValue: z.unknown().optional(),
  required: z.boolean().default(false),
  question: z.string().optional(),
  answer: z.string().optional(),
})
export type InputParameter = z.infer<typeof inputParameterSchema>;

const commandParameterSchema = z.union([z.string(), inputParameterSchema]);
export type CommandParameter = z.infer<typeof commandParameterSchema>;

export const commandDescriptorSchema = z.object({
  command: z.string(),
  parameters: z.array(commandParameterSchema),
  description: z.string(),
  nameAlias: z.string(),
});
export type ICommandDescriptor = z.infer<typeof commandDescriptorSchema>;
