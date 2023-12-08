import { z } from 'zod';
import { load } from 'js-yaml';

import { logger } from '../../internal-tools/logger';
import { ParsingError } from '../errors';
import { jsonSchema } from './jsonSchema';

type parsingResultType = z.infer<typeof jsonSchema>;

const yamlStringSchema = z.string();

type yamlStringType = z.infer<typeof yamlStringSchema>;

export function yaml(yamlString: yamlStringType): parsingResultType {
  try {
    yamlStringSchema.parse(yamlString);
    const result = load(yamlString) as parsingResultType;
    // the 'load' function can return string, number, null or undefined, so we check for that as well
    z.object({}).parse(result);
    return result;
  } catch (err) {
    logger.error('Could not parse yaml', { data: yamlString });
    throw new ParsingError('Could not parse yaml', { data: yamlString }, err as Error);
  }
}

