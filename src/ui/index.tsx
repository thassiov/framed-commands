import React from 'react'
import { Box, render } from 'ink'

import MainPage from './pages/Main'
import useStdoutDimensions from 'ink-use-stdout-dimensions'

const App = () => {
  const [columns, rows] = useStdoutDimensions()

  return (
    <Box width={columns} height={rows}>
      <MainPage />
    </Box>
  )
}

export function renderUi() {
  render(<App />)
}
