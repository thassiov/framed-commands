import React, { FC, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

import Commands from '../commands';
import Manifests from '../manifests';
import StatusBar from '../status-bar';

import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';
import { CommandStatus } from '../../../definitions/CommandStatusEnum';
import { ICommandDescriptor } from '../../../definitions/ICommandDescriptor';
import Details from '../details';

export type CommandData = {
  command: ICommandDescriptor;
  status: CommandStatus;
};

const Main: FC = () => {
  const [columns, rows] = useStdoutDimensions();

  const [manifest, setManifest] = useState<IJSONConfigFile | undefined>(undefined);

  const [commandData, setCommandData] = useState<CommandData | undefined>(undefined);

  const setSelectedManifest = (selectedManifest: IJSONConfigFile) => {
    setManifest(selectedManifest);
  };

  const unsetSelectedManifest = () => {
    setManifest(undefined);
  }

  return (
    <Box
      marginTop={1}
      width={columns}
      height={rows / 2}>
      <Box
        paddingX={2}
        width={'50%'}
        flexDirection={'column'}>
        {
          manifest ?
            <Box
              width={'100%'}
              flexDirection={'column'}>
                <SelectedManifestCollapsed
                  manifestName={manifest.name as string}
                  unsetSelectedManifest={unsetSelectedManifest} />
                <Commands manifest={manifest} setCommandData={setCommandData} />
            </Box>
                  :
            <Box
              width={'100%'}
              flexDirection={'column'}>
                <Manifests setSelectedManifest={setSelectedManifest} />
            </Box>
        }
      </Box>
      <Box
        paddingX={2}
        width={'50%'}
        flexDirection={'column'}>
        {
          manifest ?
            <>
              <StatusBar commandData={commandData} />
              <Details commandDescriptor={commandData?.command as ICommandDescriptor} />
            </>
            :
            <StatusBar message={'Select a Manifest to start running commands'} />
        }
      </Box>
    </Box>
  );
}

type SelectedManifestCollapsedProps = {
  manifestName: string;
  unsetSelectedManifest: () => void;
};

// @TODO also needs better naming
// @NOTE maybe join this with the status bar to have only one thing above the other components...
const SelectedManifestCollapsed: FC<SelectedManifestCollapsedProps> = ({ manifestName, unsetSelectedManifest }: SelectedManifestCollapsedProps) => {
  const {isFocused} = useFocus();

  useInput((_, key) => {
    if (isFocused && key.return) {
      // @TODO works, but needs a confirmation dialog because this action can be unintentional
      unsetSelectedManifest();
    }
  });

  return (
    <Box
    width={'100%'}
    borderStyle={isFocused ? 'bold' : 'round'}
    borderColor={isFocused ? 'red' : 'white'}
    flexDirection={'row'}
    alignSelf={'flex-start'}>
      <Text>Selected manifest: </Text>
      <Text>{manifestName}</Text>
    </Box>
  )
}

export default Main;
