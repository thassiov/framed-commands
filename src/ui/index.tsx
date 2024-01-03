import React from 'react';
import { render } from 'ink';

import Main from './views/main';

function renderUi(): void {
  render(<Main />);
}

export {
  renderUi,
};
