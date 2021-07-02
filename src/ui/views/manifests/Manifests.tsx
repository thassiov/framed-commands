import React, { FC, useEffect, useState } from 'react';
import {Box} from 'ink';
import SelectInput from 'ink-select-input/build';
import {Item} from 'ink-select-input/build/SelectInput';
import {IJSONConfigFile} from '../../../definitions/IJSONConfigFile';
import ManifestPickerService from '../../../services/manifest-picker';

type ChoosenManifest = IJSONConfigFile;

type ManifestsProps = {
  setManifest: React.Dispatch<ChoosenManifest>;
  donePickingManifest: () => void;
}

const Manifests: FC<ManifestsProps> = ({ setManifest, donePickingManifest }: ManifestsProps) => {
  const [manifests, setManifests] = useState([] as Array<string>);
  const manifestPickerService = new ManifestPickerService();

  useEffect(() => {
    const getListOfManifests = async () => {
      const manifests = await manifestPickerService.listManifests();
      setManifests(manifests);
    };

    getListOfManifests();
  }, []);

  const handleManifestChange = async (pickedManifest: Item<number>) => {
    const manifestObject = await manifestPickerService.loadManifest(manifests[pickedManifest.value] as string);
    setManifest(manifestObject);
    donePickingManifest();
  };

  const getItensForSelectInput = () => {
    return manifests.map((item: string, idx: number) => ({
      label: item,
      value: idx
    }));
  }

  return (
   <Box
   width={'40%'}
   flexDirection='column'
   alignSelf='flex-end'>
     <SelectInput
       limit={parseInt(process.env.MENU_HEIGHT as string)}
       items={getItensForSelectInput()}
       onSelect={handleManifestChange}
       />
   </Box>

  );
};

export default Manifests;
