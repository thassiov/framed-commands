import React, { FC } from 'react';
import ItemSelectBox from '../item-select-box';
import { Item } from 'ink-select-input/build/SelectInput';
import { parse } from 'path';

type ManifestListProps = {
  manifests: Array<string>,
  handleSelect: (commandId: number) => void;
  handleHightlight?: (commandId: number) => void;
};

const ManifestList: FC<ManifestListProps> = ({ manifests, handleSelect, handleHightlight }: ManifestListProps) => {
  const onInputSelected = (item: Item<number>) => {
    handleSelect(item.value);
  }

  const onInputHighlighted = (item: Item<number>) => {
    if (handleHightlight) {
      handleHightlight(item.value);
    }
  }

  const getItensForSelectInput = (commandsList: Array<string>) => {
    return commandsList
    .map((item: string) => parse(item).name)
    .map((item: string, idx: number) => ({
      label: item,
      value: idx,
    })
        );
  }

 return (
   <ItemSelectBox
     items={getItensForSelectInput(manifests)}
     onSelect={onInputSelected}
     onHighlight={onInputHighlighted}
   />
 );
}

export default ManifestList;
