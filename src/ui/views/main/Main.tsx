import React, { FC, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import Manifests from '../manifests';
import {IJSONConfigFile} from '../../../definitions/IJSONConfigFile';
import useStdoutDimensions from 'ink-use-stdout-dimensions';

const Main: FC = () => {
  const [columns, rows] = useStdoutDimensions();

  // @TODO manifestSelector is trash. needs renaming
  const [manifestSelector, setManifestSelector] = useState('');
  const [manifest, setManifest] = useState({} as IJSONConfigFile);

  const setSelectedManifest = (selectedManifest: IJSONConfigFile) => {
    setManifest(selectedManifest);
    setManifestSelector(selectedManifest.name || 'unnamed');
    console.log(manifest);
  };

  const unsetSelectedManifest = () => {
    setManifest({} as IJSONConfigFile);
    setManifestSelector('');
  }

  return (
    <Box
      width={columns}
      height={rows}>
      <Box>
      {
        manifestSelector ?
          <SelectedManifestCollapsed
            manifestName={manifestSelector}
            unsetSelectedManifest={unsetSelectedManifest}/>
          :
          <Manifests setSelectedManifest={setSelectedManifest} />
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
    width={'40%'}
    borderStyle={isFocused ? 'bold' : 'round'}
    borderColor={isFocused ? 'red' : 'white'}
    flexDirection={'column'}
    alignSelf={'flex-start'}>
      <Text>{manifestName}</Text>
    </Box>
  )
}

export default Main;
