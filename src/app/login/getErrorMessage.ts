export function getErrorMessage(errorParam: string | null): string {
  if (errorParam === 'RateLimit' || errorParam === 'TooManyRequests') {
    return 'Too many requests. Please wait a moment and try again.';
  } else if (errorParam === 'AccessDenied') {
    return 'Access denied. You do not have permission to log in.';
  } else if (errorParam) {
    return 'An error occurred during authentication. Please try again.';
  }
  return '';
}
