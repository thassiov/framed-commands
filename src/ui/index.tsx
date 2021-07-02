import React, { FC, useState } from 'react';
import { render } from 'ink';

import Main from './views/main';

import Manifests from './views/manifests';
import {IJSONConfigFile} from '../definitions/IJSONConfigFile';

type ChoosenManifest = IJSONConfigFile;

const FirstComponent: FC = () => {
  const [manifest, setManifest] = useState({} as ChoosenManifest);
  const [pickManifest, setPickManifest] = useState(true);

  const goPickManifest = () => setPickManifest(true);
  // maybe donePickingManifest is a better name for state than a method
  const donePickingManifest = () => setPickManifest(false);

  return (
    <>
    {
      pickManifest ?
        <Manifests setManifest={setManifest} donePickingManifest={donePickingManifest} />
        :
        <Main manifest={manifest} goPickManifest={goPickManifest} />
    }
    </>
  );
}

// receive a manifest path in the function
function renderUi(): void {
  render(<FirstComponent />);
}

export {
  renderUi,
};
