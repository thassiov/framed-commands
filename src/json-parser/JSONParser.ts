export interface IAction {
  name: string;
  description: string;
  command: string;
}

export interface IMenu {
  actions: Array<IAction>;
  output?: {
    timestamp?: boolean;
    logfile?: string;
  }
};

function instanceOfIMenu(data: any): data is IMenu {
  return 'actions' in data;
}

export function JSONParser(jsonString: string): IMenu {
  let menu: IMenu;

  try {
    menu = JSON.parse(jsonString);

    if (!instanceOfIMenu(menu)) {
      throw new Error();
    }
  } catch (jsonError) {
    throw new Error('Invalid JSON structure');
  }

  return menu;
}
