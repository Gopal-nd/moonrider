import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  ),
})
