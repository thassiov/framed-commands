import React from 'react';

import ScrollableList from '../../components/scrollableList';

const FramesListPanel = () => {
  const availableCommands = [
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
    {
      title: 'does this',
      description: 'this command does this',
      id: '1doesthis1',
    },
    {
      title: 'does that',
      description: 'this command does thas',
      id: '2doesthas2',
    },
    {
      title: 'idk',
      description: 'what does it do',
      id: '3idk3',
    },
  ];

  return (
    <ScrollableList
      list={availableCommands.map((c, idx) => ({ ...c, controlIndex: idx }))}
    />
  );
};

export default FramesListPanel;
