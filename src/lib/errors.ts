import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  Sentry.captureException(error);

  return NextResponse.json(
    { error: 'An unexpected error occurred', code: 'INTERNAL_SERVER_ERROR' },
    { status: 500 }
  );
}
