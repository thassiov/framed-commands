import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';

const LIST_MOCK_HEIGHT_IN_LINES = 30;
const LIST_ITEM_HEIGHT_IN_LINES = 3;

type ListItem = {
  title: string;
  description: string;
  id: string;
  controlIndex: number;
};

type ScrollableListProps = {
  list: ListItem[];
};

const ScrollableList = ({ list }: ScrollableListProps) => {
  const [focusedItem, setFocusedItem] = useState(0);
  const [itemsToDisplay, setItemsToDisplay] = useState<ListItem[]>([]);

  // we will display items in the screen based on this number.
  const maxListDisplayCapacity = Math.floor(
    LIST_MOCK_HEIGHT_IN_LINES / LIST_ITEM_HEIGHT_IN_LINES
  );

  const updateListItemsToDisplay = () => {
    setItemsToDisplay(list.slice(0, maxListDisplayCapacity));
  };

  const focusOnNextItem = () => {
    setFocusedItem((prev) => prev + 1);
  };

  const focusOnPreviousItem = () => {
    setFocusedItem((prev) => prev - 1);
  };

  /**
   * Make the display list show the next item from the received list
   * and hides it first item
   * @TODO needs better explanation
   */
  const rollDisplayListDownOneItem = () => {
    const itemAtTheBottom = list.findIndex(
      (item) => item.id === itemsToDisplay[itemsToDisplay.length]?.id
    );

    if (itemAtTheBottom === -1) {
      throw Error(
        `Could not roll the list down: could not find the current item at the bottom of the 
        displayed list in the provided list`
      );
    }

    // @NOTE idk about this logic here...
    setItemsToDisplay(list.slice(maxListDisplayCapacity, itemAtTheBottom - 1));
  };

  /**
   * Make the display list show the next item from the received list
   * and hides it first item
   * @TODO needs better explanation
   */
  const rollDisplayListUpOneItem = () => {
    const itemAtTheTop = list.findIndex(
      (item) => item.id === itemsToDisplay[0]?.id
    );

    if (itemAtTheTop === -1) {
      throw Error(
        `Could not roll the list up: could not find the current item at the top of the 
        displayed list in the provided list`
      );
    }

    setItemsToDisplay(list.slice(itemAtTheTop + 1, maxListDisplayCapacity));
  };

  /**
   * Resets the display list to the beginning and focus on the first item
   */
  const focusOnTheFirstItemOfTheList = () => {
    setItemsToDisplay(list.slice(0, maxListDisplayCapacity));
    setFocusedItem(0);
  };

  /**
   * Sets the display list to the tail and focus on the last item
   */
  const focusOnTheLastItemOfTheList = () => {
    const beginning =
      list.length > maxListDisplayCapacity
        ? -list.length
        : -maxListDisplayCapacity;
    setItemsToDisplay(list.slice(beginning, list.length));
    setFocusedItem(itemsToDisplay.length);
  };

  const handleFocusOnNextItem = () => {
    // are we focused on the last item of the list we received?
    const shouldGoBackToTheBeggining =
      itemsToDisplay[focusedItem]?.id === list[list.length]?.id;

    if (shouldGoBackToTheBeggining) {
      focusOnTheFirstItemOfTheList();
      return;
    }

    // determines if the cursor (focused item) is at the bottom of the list
    const shouldRollListUp = focusedItem === maxListDisplayCapacity;

    if (shouldRollListUp) {
      rollDisplayListUpOneItem();
      return;
    }

    focusOnNextItem();
  };

  const handleFocusOnPreviousItem = () => {
    // are we focused on the first item of the list we received?
    const shouldGoToTheTail = itemsToDisplay[0]?.id === list[0]?.id;

    if (shouldGoToTheTail) {
      focusOnTheLastItemOfTheList();
      return;
    }

    // determines if the cursor (focused item) is at the top of the list
    const shouldRollListDown = focusedItem === 0;

    if (shouldRollListDown) {
      rollDisplayListDownOneItem();
      return;
    }

    focusOnPreviousItem();
  };

  useInput((input, key) => {
    if (list.length === 0) {
      // nothing to do
      return;
    }

    if (['k', 'K'].includes(input) || key.upArrow) {
      handleFocusOnPreviousItem();
    }

    if (['j', 'J'].includes(input) || key.downArrow) {
      handleFocusOnNextItem();
    }
  });

  useEffect(() => {
    updateListItemsToDisplay();
  }, [focusedItem]);

  return (
    <Box flexDirection="column">
      {itemsToDisplay.map((item: ListItem, idx: number) => (
        <ScrollableListItem
          title={item.title}
          description={item.description}
          id={item.id}
          controlIndex={item.controlIndex}
          isSelected={idx === focusedItem}
        />
      ))}
    </Box>
  );
};

type ScrollableListItemProps = {
  title: string;
  description: string;
  id: string;
  controlIndex: number;
  isSelected: boolean;
};

// we know each item has 3 lines of height because there's one line for the text and two more
// for the borders. we will need to know this values to make the list be rendered properly
const ScrollableListItem = (itemProps: ScrollableListItemProps) => {
  return (
    <Box
      borderStyle="round"
      paddingLeft={1}
      paddingRight={1}
      borderColor={itemProps.isSelected ? 'green' : undefined}
    >
      <Text>
        ({itemProps.controlIndex}) {itemProps.title}
      </Text>
      <Text wrap="truncate">{itemProps.description}</Text>
    </Box>
  );
};

export default ScrollableList;
