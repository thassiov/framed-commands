#!/usr/bin/env node

import { logger } from './internal-tools/logger';
import { renderUi } from './ui';

// This represents the number of max items in the menu list
process.env.MENU_HEIGHT = '10';

(async () => {
  try {
    // start the frontend
    renderUi();
  } catch (error) {
    logger.error(error);
  }
})();
