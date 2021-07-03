import React, { FC, useEffect, useState } from 'react';
import { useInput, Box, useApp, useStdout } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

import CommandsService from '../../../services/commands';
import StatusBarService from '../../../services/status-bar';

import StatusBar from '../../components/status-bar';

import EmptyReactFragment from '../../../utils/EmptyReactFragment';

import Commands from '../commands';

type MainProps = {
  commandsService: CommandsService;
  goPickManifest: () => void;
  name: string;
};

const Main: FC<MainProps> = ({ name, commandsService, goPickManifest }: MainProps) => {

  const { exit } = useApp();
  const [columns, rows] = useStdoutDimensions();
  const { write: writeStdout } = useStdout();
  const [programStarted, setProgramStarted] = useState(false);
  const [externalComponent, setExternalComponent] = useState(EmptyReactFragment());

  const statusBarService = new StatusBarService(setExternalComponent);

  useEffect(() => {
    // To make sure the menu starts at the bottom of the screen, a number of empty lines are
    // printed to stdout and it is calculated by the number of lines the screen has in height
    // minus the menu's height.
    if (!programStarted) {
      const emptyLinesToPrint = rows - (parseInt(process.env.MENU_HEIGHT as string));
      new Array(emptyLinesToPrint)
        .fill('\n')
        .forEach(line => writeStdout(line));
      setProgramStarted(true);
    }
  });

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }

    if (key.shift && key.tab) {
      // @TODO I have to control this in a better way. For instance, do not
      // allow for this behavior when the form is open
      goPickManifest();
    }
  });

  return (
    <Box
      height={(rows * 0.20).toString()}
      width={columns}
      borderStyle={'round'}
      flexDirection={'column'}>
      <StatusBar name={name} externalComponent={externalComponent} />
      <Commands commandsService={commandsService} statusBarService={statusBarService} />
    </Box>
  );
}

export default Main;
