import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === "/airdrop") {
    const absoluteURL = new URL("/", url.origin); // Use absolute URL
    return NextResponse.redirect(absoluteURL.toString());
  }
  
  return NextResponse.next();
}
