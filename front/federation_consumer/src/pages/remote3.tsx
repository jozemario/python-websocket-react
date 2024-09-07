import { loadRemote } from '@module-federation/enhanced/runtime'
import React, { Suspense } from 'react'

const Shell = React.lazy(async () => {
  const res = await loadRemote('ui_provider/shell')
  return res
})

function Remote3() {
  return (
    <Suspense fallback={'loading'}>
      <h2>Remote3 Shell</h2>
      <Shell />
    </Suspense>
  )
}

export default Remote3
