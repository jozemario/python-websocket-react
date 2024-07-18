import { loadRemote } from '@module-federation/enhanced/runtime'
import React, { Suspense } from 'react'

const Layout = React.lazy(async () => {
  const res = await loadRemote('ui_provider/layout')
  return res
})

function Remote2() {
  return (
    <Suspense fallback={'loading'}>
      <h2>Remote2 Router</h2>
      <Layout />
    </Suspense>
  )
}

export default Remote2
