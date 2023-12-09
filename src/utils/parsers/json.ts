import { z } from 'zod';

import { ParsingError } from "../errors";
import { logger } from '../logger';
import { jsonSchema } from './jsonSchema';

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
