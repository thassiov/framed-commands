import { screen } from 'blessed';
import Commands from './views/commands';


export function renderUi(): void {
  const ui = screen();

  const commandsView = Commands({ screen: ui });

  ui.append(commandsView) //must append before setting data

  ui.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  ui.render();
}
