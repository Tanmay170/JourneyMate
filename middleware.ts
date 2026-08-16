import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that are considered protected (require authentication)
  const protectedPaths = ["/dashboard", "/profile", "/itinerary/create", "/bookmarks"]

  // Check if the path is protected
  const isPathProtected = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

  // If the path is not protected, allow the request to proceed
  if (!isPathProtected) {
    return NextResponse.next()
  }

  // Get the token from the request
  const token = await getToken({ req: request })

  // If there is no token and the path is protected, redirect to the login page
  if (!token && isPathProtected) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(url)
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/itinerary/:path*", "/bookmarks/:path*"],
}

