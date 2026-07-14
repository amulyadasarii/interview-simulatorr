import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Interview Simulator',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
          <div className="drift absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
          <div
            className="drift absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl"
            style={{ animationDelay: '-4s' }}
          />
          <div
            className="drift absolute bottom-[-6rem] left-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
            style={{ animationDelay: '-9s' }}
          />
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
