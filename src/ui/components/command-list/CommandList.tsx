import React, { FC } from 'react';
import { Item } from 'ink-select-input/build/SelectInput';

import { ICommandDescriptor } from '../../../definitions/ICommandDescriptor';
import ItemSelectBox from '../item-select-box';

type CommandListProps = {
  commands: Array<ICommandDescriptor>;
  handleSelect: (commandId: number) => void;
  handleHightlight?: (commandId: number) => void;
};

const CommandList: FC<CommandListProps> = ({ commands, handleSelect, handleHightlight }: CommandListProps) => {
  const onInputSelected = (item: Item<number>) => {
    handleSelect(item.value);
  }

  const onInputHighlighted = (item: Item<number>) => {
    if (handleHightlight) {
      handleHightlight(item.value);
    }
  }

  const getItensForSelectInput = () => {
    return commands
     .map((item: ICommandDescriptor, idx: number) => ({
         label: item.nameAlias,
         value: idx,
       })
     );
  }

 return (
   <ItemSelectBox
     items={getItensForSelectInput()}
     onSelect={onInputSelected}
     onHighlight={onInputHighlighted}
   />
 );
}

export default CommandList;
