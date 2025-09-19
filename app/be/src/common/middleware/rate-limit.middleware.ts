import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      message: config.message || 'Too many requests, please try again later.',
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
    };
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const key = this.getKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Clean up expired entries
    this.cleanupExpiredEntries(windowStart);

    // Get or create entry for this key
    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    const entry = this.store[key];

    // Check if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    // Check if limit is exceeded
    if (entry.count >= this.config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      res.set({
        'X-RateLimit-Limit': this.config.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
        'Retry-After': retryAfter.toString(),
      });

      throw new HttpException(
        {
          success: false,
          message: this.config.message,
          data: null,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            details: {
              limit: this.config.maxRequests,
              windowMs: this.config.windowMs,
              retryAfter,
            },
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    entry.count++;

    // Set rate limit headers
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    res.set({
      'X-RateLimit-Limit': this.config.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
    });

    next();
  }

  private getKey(req: Request): string {
    // Use IP address as the primary key for rate limiting
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return `rate_limit:${ip}`;
  }

  private cleanupExpiredEntries(windowStart: number): void {
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < windowStart) {
        delete this.store[key];
      }
    });
  }

  /**
   * Get current rate limit status for a given key
   */
  getStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store[key];
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return null; // Window has expired
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a given key
   */
  reset(key: string): void {
    delete this.store[key];
  }

  /**
   * Get all current rate limit entries (for monitoring/debugging)
   */
  getAllEntries(): RateLimitStore {
    return { ...this.store };
  }
}

/**
 * Factory function to create rate limit middleware with predefined configurations
 */
export class RateLimitFactory {
  /**
   * Create rate limit middleware for like endpoints
   * Default: 10 requests per minute per IP
   */
  static forLikeEndpoints(): (req: Request, res: Response, next: NextFunction) => void {
    const middleware = new RateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute
      message: 'Too many like/unlike requests. Please wait before trying again.',
    });
    return middleware.use.bind(middleware);
  }

  /**
   * Create rate limit middleware for general API endpoints
   * Default: 100 requests per minute per IP
   */
  static forGeneralAPI(): (req: Request, res: Response, next: NextFunction) => void {
    const middleware = new RateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
      message: 'Too many requests. Please wait before trying again.',
    });
    return middleware.use.bind(middleware);
  }

  /**
   * Create rate limit middleware for strict endpoints
   * Default: 5 requests per minute per IP
   */
  static forStrictEndpoints(): (req: Request, res: Response, next: NextFunction) => void {
    const middleware = new RateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 requests per minute
      message: 'Rate limit exceeded for this endpoint. Please wait before trying again.',
    });
    return middleware.use.bind(middleware);
  }

  /**
   * Create custom rate limit middleware
   */
  static custom(config: RateLimitConfig): (req: Request, res: Response, next: NextFunction) => void {
    const middleware = new RateLimitMiddleware(config);
    return middleware.use.bind(middleware);
  }
}
