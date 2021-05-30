import React, { FC } from 'react';
import SelectInput from 'ink-select-input';

import CommandRunner from '../../command-runner';
import {Item} from 'ink-select-input/build/SelectInput';
import {Box} from 'ink';

interface ICommandListItem {
  nameAlias: string;
  description: string;
}

interface IUIProps {
  commandRunner: CommandRunner;
  handleSelect: (commandId: number) => void;
  handleHightlight: (commandId: number) => void;
}

const MenuList: FC<IUIProps> = ({ commandRunner, handleSelect, handleHightlight }: IUIProps) => {
  const onInputSelected = (item: Item<number>) => {
    handleSelect(item.value);
  }

  const onInputHighlighted = (item: Item<number>) => {
    handleHightlight(item.value);
  }

  const getItensForSelectInput = (commands: Array<ICommandListItem>) => {
    return commands
     .map((item: ICommandListItem, idx: number) => ({
         label: item.nameAlias,
         value: idx,
       })
     );
  }

 return (
   <Box width={'15%'} flexDirection="column" alignSelf='flex-end'>
     <SelectInput
       items={getItensForSelectInput(commandRunner.getCommandList())}
       onSelect={onInputSelected}
       onHighlight={onInputHighlighted}
       />
   </Box>
 );
}

export default MenuList;
