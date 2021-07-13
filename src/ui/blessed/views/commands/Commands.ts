import {box, Widgets} from "blessed";
import CommandList from "../../components/command-list";

interface CommandsViewProps {
  screen: Widgets.Screen,
}

function Commands(commandsViewProps: CommandsViewProps): Widgets.BoxElement {
  const view = box({
    parent: commandsViewProps.screen,
  });

  const runCommandById = (index: number) => {
    console.log(index);
  }

  const commandList = CommandList({
    screen: commandsViewProps.screen,
    onSelectHandler: runCommandById,
  });

  view.append(commandList);

  return view;
}

export default Commands;
