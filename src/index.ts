#!/usr/bin/env node

import { logger } from './internal-tools/logger';
import { getSheetFilePath } from './cli';
import { renderUi } from './ui';
import { manifestLoader } from './services/manifest-loader';

// This represents the number of max items in the menu list
process.env.MENU_HEIGHT = '10';

(async () => {
  const path = getSheetFilePath(process.argv);
  const manifest = await manifestLoader(path);
  manifest;
  // start the frontend
  renderUi(manifest);
})().catch((err) => {
  logger.error(err);
  logger.error(err.message);
  logger.error('Exiting...');
  process.exit(err.code);
});
