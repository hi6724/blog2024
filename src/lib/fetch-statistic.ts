/** A failed optional statistic must not take down the home page. */
export async function fetchStatistic(url: string, options: RequestInit = {}): Promise<number | null> {
  try {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Expected a JSON response');
    }
    const value: unknown = await response.json();
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new Error('Expected a non-negative number');
    }
    return value;
  } catch (error) {
    // Do not log upstream response bodies, which may contain sensitive data.
    console.error('Home statistic unavailable', new URL(url).pathname,
      error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
