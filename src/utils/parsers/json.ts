import { z } from 'zod';

import { logger } from "../../internal-tools/logger";
import { ParsingError } from "../errors";

// validates json [https://zod.dev/?id=json-type]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

type parsingResultType = z.infer<typeof jsonSchema>;

const jsonStringSchema = z.string();

type jsonStringType = z.infer<typeof jsonStringSchema>;

export function json(jsonString: jsonStringType): parsingResultType {
  try {
    jsonStringSchema.parse(jsonString)
    return JSON.parse(jsonString);
  } catch (err) {
    logger.error('Could not parse json', { data: jsonString });
    throw new ParsingError('Could not parse json', { data: jsonString }, err as Error);
  }
}
