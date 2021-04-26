import {IJSONConfigFile} from "../definitions/IJSONConfigFile";

function instanceOfConfigFile(data: any): data is IJSONConfigFile {
  return 'commands' in data;
}

export function JSONParser(jsonString: string): IJSONConfigFile {
  let config: IJSONConfigFile;

  try {
    config = JSON.parse(jsonString);

    if (!instanceOfConfigFile(config)) {
      throw new Error();
    }
  } catch (jsonError) {
    throw new Error('Invalid JSON structure');
  }

  return config;
}
