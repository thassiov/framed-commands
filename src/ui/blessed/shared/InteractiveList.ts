import {list, Widgets} from "blessed";

interface InteractiveListProps {
  screen?: Widgets.Screen,
  listData: any[],
  onSelectHandler?: (index: number) => void;
}

export function InteractiveList(listProps: InteractiveListProps): Widgets.ListElement {
  const interactiveList = list({
    keyable: true,
    label: 'Commands',
    items: listProps.listData,
    width: '25%',
    border: {
      type: 'line',
      fg: 3
    },
    style: {
      selected: {
        fg: 'black',
        bg: 'yellow',
      }
    },
  });

  let selectedItem = 0;

  interactiveList.on('keypress', (_, key) => {
    if (key.name === 'up' || key.name === 'k') {
      interactiveList.up(1);
      listProps.screen?.render();
      return;
    } else if (key.name === 'down' || key.name === 'j') {
      interactiveList.down(1);
      listProps.screen?.render();
      return;
    } else if (key.name === 'enter') {
      if (listProps.onSelectHandler) {
        listProps.onSelectHandler(selectedItem);
      }
      return;
    }
  });

  interactiveList.on('select item', (_, index) => {
    selectedItem = index;
  });

  return interactiveList;
}
