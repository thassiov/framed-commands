import {logger} from "./logger";

type ParsingResult = {
  [name: string]: any;
};

export function JSONParser(jsonString: string): ParsingResult {
  try {
    return JSON.parse(jsonString);
  } catch (jsonError) {
    logger.error('Could not parse JSON structure:', jsonError.message);
    throw jsonError;
  }
}
