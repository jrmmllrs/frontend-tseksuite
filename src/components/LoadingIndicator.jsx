import React from 'react'
import { CircularProgress } from '@mui/material'
function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
            <CircularProgress />
            <h6>Fetching Data ...</h6>
    </div>
  )
}

export default LoadingIndicator
