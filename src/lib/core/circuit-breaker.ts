export type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  requestTimeoutMs: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeoutMs: 30000,
  requestTimeoutMs: 5000,
};

interface BreakerInfo {
  state: BreakerState;
  failures: number;
  nextAttempt: number;
}

const breakers = new Map<string, BreakerInfo>();

export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

export async function fetchWithCircuitBreaker(
  id: string,
  input: string | URL | Request,
  init?: RequestInit,
  customConfig?: Partial<CircuitBreakerConfig>
): Promise<Response> {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  
  let breaker = breakers.get(id);
  if (!breaker) {
    breaker = { state: 'CLOSED', failures: 0, nextAttempt: 0 };
    breakers.set(id, breaker);
  }

  if (breaker.state === 'OPEN') {
    if (Date.now() > breaker.nextAttempt) {
      breaker.state = 'HALF_OPEN';
    } else {
      throw new CircuitBreakerError(`Circuit breaker '${id}' is OPEN.`);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.requestTimeoutMs);
  
  // Link the incoming signal if present
  if (init?.signal) {
    init.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok && res.status >= 500) {
      // Treat 5xx as a failure for the circuit breaker
      handleFailure(id, breaker, config);
    } else {
      handleSuccess(id, breaker);
    }

    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    handleFailure(id, breaker, config);
    throw error;
  }
}

function handleSuccess(id: string, breaker: BreakerInfo) {
  if (breaker.state === 'HALF_OPEN' || breaker.failures > 0) {
    breaker.state = 'CLOSED';
    breaker.failures = 0;
  }
}

function handleFailure(id: string, breaker: BreakerInfo, config: CircuitBreakerConfig) {
  breaker.failures += 1;
  if (breaker.failures >= config.failureThreshold || breaker.state === 'HALF_OPEN') {
    breaker.state = 'OPEN';
    breaker.nextAttempt = Date.now() + config.resetTimeoutMs;
    console.warn(`[CircuitBreaker] '${id}' tripped OPEN. Will retry after ${config.resetTimeoutMs}ms.`);
  }
}
