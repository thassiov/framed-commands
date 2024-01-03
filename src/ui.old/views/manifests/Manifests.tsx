import React, { FC, useEffect, useState } from 'react';
import {Box, Text, useFocus} from 'ink';
import ManifestPickerService from '../../../services/manifest-picker';
import ManifestList from '../../components/manifest-list/ManifestList';
import {IJSONConfigFile} from '../../../definitions/IJSONConfigFile';

type ManifestsProps = {
  setSelectedManifest: (selectedManifest: IJSONConfigFile) => void;
}

const Manifests: FC<ManifestsProps> = ({ setSelectedManifest }: ManifestsProps) => {
  const {isFocused} = useFocus({ autoFocus: true });
  const [manifests, setManifests] = useState([] as Array<string>);
  const manifestPickerService = new ManifestPickerService();

  useEffect(() => {
    const getListOfManifests = async () => {
      const manifests = await manifestPickerService.listManifests();
      setManifests(manifests);
    };

    getListOfManifests();
  }, []);

  const handleManifestChange = async (pickedManifest: number) => {
    const manifest = await manifestPickerService.loadManifest(manifests[pickedManifest] as string);
    console.log(manifest);
    setSelectedManifest(manifest);
  };

  return (
   <Box
   width={'100%'}
   borderStyle={isFocused ? 'bold' : 'round'}
   borderColor={isFocused ? 'red' : 'white'}
   flexDirection={'column'}
   alignSelf={'flex-start'}>
   {
     manifests.length ?
       <ManifestList
        manifests={manifests}
        handleSelect={handleManifestChange}
     />
     :
       <Text>No manifests available</Text>
   }
   </Box>

  );
};

export default Manifests;
