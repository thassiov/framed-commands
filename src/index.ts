#!/usr/bin/env node

import { logger } from './internal-tools/logger';
import { getFilePathFromCliArgs } from './internal-tools/getFilePathFromCliArgs';
import { renderUi } from './ui';
import ManifestPickerService from './services/manifest-picker';

// This represents the number of max items in the menu list
process.env.MENU_HEIGHT = '10';

(async () => {
  try {
    const path = getFilePathFromCliArgs(process.argv);
    if (path) {
      const mps = new ManifestPickerService();
      const manifest = await mps.loadManifest(path);

      // start the frontend
      renderUi(manifest);
    } else {
      renderUi();
    }

  } catch (error) {
    logger.error(error);
  }
})();
