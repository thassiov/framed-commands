import React, { FC, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

import Commands from '../commands';
import Manifests from '../manifests';
import StatusBar from '../status-bar';

import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';
import { CommandStatus } from '../../../definitions/CommandStatusEnum';
import { ICommandDescriptor } from '../../../definitions/ICommandDescriptor';

export type CommandData = {
  command: ICommandDescriptor;
  status: CommandStatus;
};

const Main: FC = () => {
  const [columns, rows] = useStdoutDimensions();

  // @TODO manifestSelector is trash. needs renaming. Also, this is here just because I didn't want to
  // put in the render manifest.name ? <things> : <other thing> because `name` is optional.
  // this is a control state. I need a better way of solving this thing
  const [manifestSelector, setManifestSelector] = useState('');
  const [manifest, setManifest] = useState({} as IJSONConfigFile);

  const [commandData, setCommandData] = useState<CommandData | undefined>(undefined);

  const setSelectedManifest = (selectedManifest: IJSONConfigFile) => {
    setManifest(selectedManifest);
    setManifestSelector(selectedManifest.name || 'unnamed');
    console.log(manifest);
  };

  const unsetSelectedManifest = () => {
    setManifestSelector('');
  }

  return (
    <Box
      width={columns}
      height={rows}>
      <Box
        paddingX={2}
        width={'50%'}
        flexDirection={'column'}>
        {
          manifestSelector ?
            <Box
              width={'100%'}
              flexDirection={'column'}>
                <SelectedManifestCollapsed
                  manifestName={manifestSelector}
                  unsetSelectedManifest={unsetSelectedManifest}/>
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
          manifestSelector ?
            <StatusBar commandData={commandData} />
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
    flexDirection={'column'}
    alignSelf={'flex-start'}>
      <Text>{manifestName}</Text>
    </Box>
  )
}

export default Main;
