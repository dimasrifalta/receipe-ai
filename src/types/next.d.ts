import { NextRequest } from 'next/server';

// This extends the Next.js types to work with our API route handlers
declare module 'next/dist/server/web/spec-extension/request' {
  interface Request extends NextRequest {}
}

// Define route handler params context
declare global {
  interface RouteHandlerContext<Params = any> {
    params: Params;
  }
}

export {};