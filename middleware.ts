import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if the pathname is exactly 6 characters long (1 for the "/" and 5 for the code)
  // if (pathname.length === 6 && pathname.startsWith("/")) {
  //   // Extract the code after the "/"
  //   const code = pathname.substring(1);
  //   // Construct the new URL with the query parameter
  //   const newUrl = new URL("/airdrop", request.url);
  //   newUrl.searchParams.set("code", code);
  //   // Redirect to the new URL
  //   return NextResponse.redirect(newUrl);
  // }

  // if (request.url.endsWith("/")) {
  //   // Redirect to /airdrop
  //   return NextResponse.redirect(new URL("/airdrop", request.url));
  // }

  return NextResponse.next();
}
