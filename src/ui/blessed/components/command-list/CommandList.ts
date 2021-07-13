import CommandsService from '../../../../services/commands';
import { ICommandDescriptor } from '../../../../definitions/ICommandDescriptor';

import { InteractiveList } from '../../shared';

import { /* box, */ Widgets} from "blessed";

interface CommandListProps {
  screen: Widgets.Screen;
  onSelectHandler: (index: number) => void;
}

function CommandList(commandListProps: CommandListProps): Widgets.BoxElement {
  const commands = new CommandsService(JSON.parse(process.env.EXAMPLE_MANIFEST as string));

  const listData = commands.getCommandList().map((command: ICommandDescriptor) => command.nameAlias);

  const interactiveList = InteractiveList({
    screen: commandListProps.screen,
    listData,
    onSelectHandler: commandListProps.onSelectHandler,
  });

  interactiveList.focus();

  return interactiveList;
}

export default CommandList;
