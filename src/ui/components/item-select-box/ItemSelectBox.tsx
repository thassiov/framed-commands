import React, { FC } from 'react';
import SelectInput from 'ink-select-input';
import { Box } from 'ink';
import { Item } from 'ink-select-input/build/SelectInput';

type ItemSelectBoxProps = {
  items: { label: string, value: number }[];
  onHighlight?: (item: Item<number>) => void;
  onSelect?: (item: Item<number>) => void;
  boxLayout?: {
    width: string | number | undefined;
    alignSelf: 'flex-end' | 'flex-start' | 'center' | 'auto' | undefined;
  }
}

const ItemSelectBox: FC<ItemSelectBoxProps> = ({
  items,
  onSelect,
  onHighlight,
  boxLayout,
}: ItemSelectBoxProps) => {

  return (
    <Box
    width={ boxLayout?.width || '40%'}
    flexDirection='column'
    alignSelf={ boxLayout?.alignSelf || 'flex-end' }>
      <SelectInput
      limit={parseInt(process.env.MENU_HEIGHT as string)}
      items={items}
      onSelect={onSelect || (() => {return})}
      onHighlight={onHighlight || (() => {return})}/>
    </Box>
  );
};

export default ItemSelectBox;
