import { load } from 'js-yaml';
import { logger } from './logger';

type ConvertionResult = {
  [name: string]: any;
};

export async function yamlToJson(yamlConfig: string): Promise<ConvertionResult> {
  try {
    return load(yamlConfig) as ConvertionResult;
  } catch (convertionError) {
    logger.error('Could not convert yaml config file:', convertionError.message);
    throw convertionError;
  }
}

