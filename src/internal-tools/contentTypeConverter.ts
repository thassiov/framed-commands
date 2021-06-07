import { load } from 'js-yaml';
import { logger } from './logger';

type ConvertionResult = {
  [name: string]: any;
};

export async function yamlToJson(yamlConfig: string): Promise<ConvertionResult> {
  try {
    console.log('what is the content of yamlConfig:', yamlConfig);
    return load(yamlConfig) as ConvertionResult;
  } catch (convertionError) {
    logger.error('Could not convert yaml config file:', convertionError.message);
    throw convertionError;
  }
}

