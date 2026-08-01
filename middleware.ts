// middleware.ts

import { withAuth } from "next-auth/middleware"
import { isAuthorized } from "@/lib/auth/authorize"

export default withAuth(
  function middleware(req) {
    // Additional logic if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => isAuthorized(token, req.nextUrl.pathname),
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
}
