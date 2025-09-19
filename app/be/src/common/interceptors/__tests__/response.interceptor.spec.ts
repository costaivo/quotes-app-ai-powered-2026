import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from '../response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockExecutionContext = {
      switchToHttp: jest.fn(),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should wrap response data in standardized envelope', (done) => {
    const testData = { id: '1', quote: 'Test quote', author: 'Test Author' };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: testData,
          success: true,
          message: 'Operation completed successfully',
        });
        done();
      },
      error: done,
    });
  });

  it('should handle null data', (done) => {
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: null,
          success: true,
          message: 'Operation completed successfully',
        });
        done();
      },
      error: done,
    });
  });

  it('should handle array data', (done) => {
    const testData = [
      { id: '1', quote: 'Quote 1', author: 'Author 1' },
      { id: '2', quote: 'Quote 2', author: 'Author 2' },
    ];
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: testData,
          success: true,
          message: 'Operation completed successfully',
        });
        done();
      },
      error: done,
    });
  });
});
