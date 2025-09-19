import { validate } from 'class-validator';
import { CreateQuoteDto } from '../create-quote.dto';

describe('CreateQuoteDto', () => {
  let dto: CreateQuoteDto;

  beforeEach(() => {
    dto = new CreateQuoteDto();
  });

  describe('quote field', () => {
    it('should pass validation with valid quote', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should fail validation when quote is empty', async () => {
      dto.quote = '';
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when quote is missing', async () => {
      dto.author = 'Test Author';
      // quote is undefined

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when quote is not a string', async () => {
      (dto as any).quote = 123;
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with quote at maximum length (1000 characters)', async () => {
      dto.quote = 'A'.repeat(1000);
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should fail validation when quote exceeds maximum length (1001 characters)', async () => {
      dto.quote = 'A'.repeat(1001);
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.maxLength).toBeDefined();
      expect(quoteErrors[0].constraints?.maxLength).toContain('1000');
    });

    it('should pass validation when quote is only whitespace (trimmed by service)', async () => {
      dto.quote = '   ';
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      // @IsNotEmpty() doesn't consider whitespace-only strings as empty
      // The service layer handles trimming, so this is valid input
      expect(quoteErrors).toHaveLength(0);
    });
  });

  describe('author field', () => {
    it('should pass validation with valid author', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should fail validation when author is empty', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = '';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when author is missing', async () => {
      dto.quote = 'This is a valid quote.';
      // author is undefined

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when author is not a string', async () => {
      dto.quote = 'This is a valid quote.';
      (dto as any).author = 123;

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with author at maximum length (200 characters)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'A'.repeat(200);

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should fail validation when author exceeds maximum length (201 characters)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'A'.repeat(201);

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.maxLength).toBeDefined();
      expect(authorErrors[0].constraints?.maxLength).toContain('200');
    });

    it('should pass validation when author is only whitespace (trimmed by service)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = '   ';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      // @IsNotEmpty() doesn't consider whitespace-only strings as empty
      // The service layer handles trimming, so this is valid input
      expect(authorErrors).toHaveLength(0);
    });
  });

  describe('tags field', () => {
    it('should pass validation with valid tags', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = 'tag1;tag2;tag3';

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is undefined (optional field)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      // tags is undefined

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is null (optional field)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = null as any;

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is empty string', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = '';

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should fail validation when tags is not a string', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      (dto as any).tags = 123;

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(1);
      expect(tagsErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with tags at maximum length (500 characters)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = 'A'.repeat(500);

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should fail validation when tags exceeds maximum length (501 characters)', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = 'A'.repeat(501);

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(1);
      expect(tagsErrors[0].constraints?.maxLength).toBeDefined();
      expect(tagsErrors[0].constraints?.maxLength).toContain('500');
    });
  });

  describe('complete DTO validation', () => {
    it('should pass validation with all valid fields', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';
      dto.tags = 'tag1;tag2;tag3';

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only required fields', async () => {
      dto.quote = 'This is a valid quote.';
      dto.author = 'Test Author';

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with multiple invalid fields', async () => {
      dto.quote = '';
      dto.author = '';
      dto.tags = 'A'.repeat(501);

      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      
      const quoteErrors = errors.filter(error => error.property === 'quote');
      const authorErrors = errors.filter(error => error.property === 'author');
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(quoteErrors).toHaveLength(1);
      expect(authorErrors).toHaveLength(1);
      expect(tagsErrors).toHaveLength(1);
    });
  });
});
