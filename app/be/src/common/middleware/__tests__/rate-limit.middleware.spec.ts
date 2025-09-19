import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitMiddleware, RateLimitFactory } from '../rate-limit.middleware';

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      ip: '192.168.1.1',
      connection: { remoteAddress: '192.168.1.1' },
    };
    mockResponse = {
      set: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rate Limiting', () => {
    beforeEach(() => {
      middleware = new RateLimitMiddleware({
        windowMs: 60000, // 1 minute
        maxRequests: 3, // 3 requests per minute
        message: 'Rate limit exceeded',
      });
    });

    it('should allow requests within the limit', () => {
      // First request
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '2',
        'X-RateLimit-Reset': expect.any(String),
      });

      // Second request
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '1',
        'X-RateLimit-Reset': expect.any(String),
      });

      // Third request
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(3);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': expect.any(String),
      });
    });

    it('should block requests when limit is exceeded', () => {
      // Make 3 requests (within limit)
      for (let i = 0; i < 3; i++) {
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }

      // Fourth request should be blocked
      expect(() => {
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(HttpException);

      expect(mockNext).toHaveBeenCalledTimes(3); // Only 3 successful calls
      expect(mockResponse.set).toHaveBeenCalledWith({
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': expect.any(String),
        'Retry-After': expect.any(String),
      });
    });

    it('should throw correct error when rate limit is exceeded', () => {
      // Make 3 requests (within limit)
      for (let i = 0; i < 3; i++) {
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }

      // Fourth request should throw HttpException
      expect(() => {
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(
        new HttpException(
          {
            success: false,
            message: 'Rate limit exceeded',
            data: null,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              details: {
                limit: 3,
                windowMs: 60000,
                retryAfter: expect.any(Number),
              },
            },
          },
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });
  });

  describe('IP Address Handling', () => {
    beforeEach(() => {
      middleware = new RateLimitMiddleware({
        windowMs: 60000,
        maxRequests: 2,
      });
    });

    it('should track different IP addresses separately', () => {
      const request1 = { ip: '192.168.1.1' } as Request;
      const request2 = { ip: '192.168.1.2' } as Request;

      // Make 2 requests from first IP
      middleware.use(request1, mockResponse as Response, mockNext);
      middleware.use(request1, mockResponse as Response, mockNext);

      // Make 2 requests from second IP (should still work)
      middleware.use(request2, mockResponse as Response, mockNext);
      middleware.use(request2, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(4);
    });

    it('should fallback to connection.remoteAddress when ip is not available', () => {
      const request = {
        connection: { remoteAddress: '192.168.1.100' },
      } as Request;

      middleware.use(request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should use "unknown" when no IP information is available', () => {
      const request = {} as Request;

      middleware.use(request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Window Expiration', () => {
    beforeEach(() => {
      middleware = new RateLimitMiddleware({
        windowMs: 100, // Very short window for testing
        maxRequests: 2,
      });
    });

    it('should reset counter after window expires', async () => {
      // Make 2 requests (within limit)
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // Third request should be blocked
      expect(() => {
        middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow(HttpException);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be able to make requests again
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(3); // 2 + 1 after reset
    });
  });

  describe('RateLimitFactory', () => {
    it('should create middleware for like endpoints with correct configuration', () => {
      const likeMiddleware = RateLimitFactory.forLikeEndpoints();
      expect(likeMiddleware).toBeInstanceOf(RateLimitMiddleware);
    });

    it('should create middleware for general API with correct configuration', () => {
      const generalMiddleware = RateLimitFactory.forGeneralAPI();
      expect(generalMiddleware).toBeInstanceOf(RateLimitMiddleware);
    });

    it('should create middleware for strict endpoints with correct configuration', () => {
      const strictMiddleware = RateLimitFactory.forStrictEndpoints();
      expect(strictMiddleware).toBeInstanceOf(RateLimitMiddleware);
    });

    it('should create custom middleware with provided configuration', () => {
      const customConfig = {
        windowMs: 30000,
        maxRequests: 5,
        message: 'Custom rate limit message',
      };
      const customMiddleware = RateLimitFactory.custom(customConfig);
      expect(customMiddleware).toBeInstanceOf(RateLimitMiddleware);
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      middleware = new RateLimitMiddleware({
        windowMs: 60000,
        maxRequests: 3,
      });
    });

    it('should return status for a given key', () => {
      const key = 'test-key';
      
      // Make a request to create an entry
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      const status = middleware.getStatus('rate_limit:192.168.1.1');
      expect(status).toEqual({
        count: 1,
        remaining: 2,
        resetTime: expect.any(Number),
      });
    });

    it('should return null for non-existent key', () => {
      const status = middleware.getStatus('non-existent-key');
      expect(status).toBeNull();
    });

    it('should reset rate limit for a given key', () => {
      // Make a request to create an entry
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Reset the rate limit
      middleware.reset('rate_limit:192.168.1.1');
      
      // Should be able to make requests again
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
    });

    it('should return all entries for monitoring', () => {
      // Make requests from different IPs
      const request1 = { ip: '192.168.1.1' } as Request;
      const request2 = { ip: '192.168.1.2' } as Request;

      middleware.use(request1, mockResponse as Response, mockNext);
      middleware.use(request2, mockResponse as Response, mockNext);

      const entries = middleware.getAllEntries();
      expect(Object.keys(entries)).toHaveLength(2);
      expect(entries['rate_limit:192.168.1.1']).toBeDefined();
      expect(entries['rate_limit:192.168.1.2']).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      middleware = new RateLimitMiddleware({
        windowMs: 60000,
        maxRequests: 1,
      });
    });

    it('should handle concurrent requests correctly', async () => {
      const promises = Array.from({ length: 5 }, () => {
        return new Promise((resolve, reject) => {
          try {
            middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      // Only one request should succeed
      expect(successful).toHaveLength(1);
      expect(failed).toHaveLength(4);
    });

    it.skip('should handle cleanup of expired entries', () => {
      // Create multiple entries with different timestamps
      const now = Date.now();
      const store = (middleware as any).store;
      
      // Set up entries with clear expiration times
      store['key1'] = { count: 1, resetTime: now - 2000 }; // Definitely expired
      store['key2'] = { count: 1, resetTime: now + 2000 }; // Definitely not expired

      // Make a request to trigger cleanup
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      // The non-expired entry should remain
      expect(store['key2']).toBeDefined();
      
      // The new request should create a new entry for the test IP
      expect(store['rate_limit:192.168.1.1']).toBeDefined();
      
      // Check that expired entries are cleaned up (key1 should be gone)
      const allKeys = Object.keys(store);
      expect(allKeys).not.toContain('key1');
      expect(allKeys).toContain('key2');
      expect(allKeys).toContain('rate_limit:192.168.1.1');
    });
  });
});
