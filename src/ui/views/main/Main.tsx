import React, { FC, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import Manifests from '../manifests';
import { IJSONConfigFile } from '../../../definitions/IJSONConfigFile';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import Commands from '../commands';

const Main: FC = () => {
  const [columns, rows] = useStdoutDimensions();

  // @TODO manifestSelector is trash. needs renaming. Also, this is here just because I didn't want to
  // put in the render manifest.name ? <things> : <other thing> because `name` is optional.
  // this is a control state. I need a better way of solving this thing
  const [manifestSelector, setManifestSelector] = useState('');
  const [manifest, setManifest] = useState({} as IJSONConfigFile);

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
        {
          manifestSelector ?
            <Box
              width={'100%'}
              flexDirection={'column'}>
                <SelectedManifestCollapsed
                  manifestName={manifestSelector}
                  unsetSelectedManifest={unsetSelectedManifest}/>
                <Commands manifest={manifest} />
            </Box>
                  :
            <Box
              width={'100%'}
              flexDirection={'column'}>
                <Manifests setSelectedManifest={setSelectedManifest} />
            </Box>
        }
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
