#!/usr/bin/env node

import { renderUi } from './ui/';

(() => {
  // @TODO here we should initialize the application:
  //  - load the database
  //  - load the user frames (configs) inside the application directory
  //  - load the services
  //  - then call the ui renderer
  renderUi();
})();
