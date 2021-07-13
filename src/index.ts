#!/usr/bin/env node

import { logger } from './internal-tools/logger';
import { getFilePathFromCliArgs } from './internal-tools/getFilePathFromCliArgs';
import { renderUi } from './ui/blessed';
import ManifestPickerService from './services/manifest-picker';

// This represents the number of max items in the menu list
process.env.MENU_HEIGHT = '10';


(async () => {
  try {
    const path = getFilePathFromCliArgs(process.argv);
    const mps = new ManifestPickerService();
    const { commands } = await mps.loadManifest(path);

    process.env.EXAMPLE_MANIFEST = JSON.stringify(commands);

    // start the frontend
    renderUi();
  } catch (error) {
    logger.error(error);
  }
})();
