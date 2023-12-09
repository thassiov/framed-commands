import { z } from 'zod';

import {commandDescriptorSchema} from "./ICommandDescriptor";

export const configFileSchema = z.object({
  name: z.string().optional(),
  commands: z.array(commandDescriptorSchema),
});

export type IConfigFile = z.infer<typeof configFileSchema>;
