import React from 'react'
import { Box } from 'ink'

import CommandsListPanel from './commandsListPanel'

const Main = () => {
  return (
    <Box borderStyle="single" flexGrow={1}>
      <Box width="30%" borderStyle="single">
        <CommandsListPanel />
      </Box>
    </Box>
  )
}

export default Main
