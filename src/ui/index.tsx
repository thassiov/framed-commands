import React from 'react';
import { render } from 'ink';

import Main from './views/main';

// receive a manifest path in the function
// function renderUi(manifestFromCli?: ChoosenManifest): void {
function renderUi(): void {
  render(<Main />);
}

export {
  renderUi,
};
