/**
 * Dedicated Logger Utility
 * Wraps console.warn and console.error for production-ready error tracing.
 * Avoids the use of console.log.
 */

export const Logger = {
  warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(`[PitWall WARN] ${message}`, ...optionalParams);
  },
  
  error(message: string, ...optionalParams: unknown[]): void {
    console.error(`[PitWall ERROR] ${message}`, ...optionalParams);
  }
};
