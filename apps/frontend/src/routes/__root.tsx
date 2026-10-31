import { createRootRoute, useLocation, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => {
    const location = useLocation()
    const isAuthPage = location.pathname === '/auth'

    return (
      <>
        {!isAuthPage && (
          <nav className="bg-background border-border border-b">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="text-foreground text-lg font-semibold">
                  App
                </div>
              </div>
            </div>
          </nav>
        )}
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  },
})
