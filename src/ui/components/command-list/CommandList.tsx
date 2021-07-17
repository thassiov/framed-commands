import React, { FC } from 'react';
import { Item } from 'ink-select-input/build/SelectInput';

import { ICommandDescriptor } from '../../../definitions/ICommandDescriptor';
import ItemSelectBox from '../item-select-box';

type MenuListProps = {
  handleSelect: (commandId: number) => void;
  handleHightlight: (commandId: number) => void;
  commandsList: Array<ICommandDescriptor>;
};

const CommandList: FC<MenuListProps> = ({ commandsList, handleSelect, handleHightlight }: MenuListProps) => {
  const onInputSelected = (item: Item<number>) => {
    handleSelect(item.value);
  }

  const onInputHighlighted = (item: Item<number>) => {
    handleHightlight(item.value);
  }

  const getItensForSelectInput = (commandsList: Array<ICommandDescriptor>) => {
    return commandsList
     .map((item: ICommandDescriptor, idx: number) => ({
         label: item.nameAlias,
         value: idx,
       })
     );
  }

 return (
   <ItemSelectBox
     items={getItensForSelectInput(commandsList)}
     onSelect={onInputSelected}
     onHighlight={onInputHighlighted}
   />
 );
}

export default CommandList;
