import { validate } from 'class-validator';
import { UpdateQuoteDto } from '../update-quote.dto';

describe('UpdateQuoteDto', () => {
  let dto: UpdateQuoteDto;

  beforeEach(() => {
    dto = new UpdateQuoteDto();
  });

  describe('quote field (optional)', () => {
    it('should pass validation with valid quote', async () => {
      dto.quote = 'This is a valid updated quote.';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should pass validation when quote is undefined (optional field)', async () => {
      // quote is undefined

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should pass validation when quote is null (optional field)', async () => {
      dto.quote = null as any;

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should fail validation when quote is empty string', async () => {
      dto.quote = '';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when quote is not a string', async () => {
      (dto as any).quote = 123;

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with quote at maximum length (1000 characters)', async () => {
      dto.quote = 'A'.repeat(1000);

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(0);
    });

    it('should fail validation when quote exceeds maximum length (1001 characters)', async () => {
      dto.quote = 'A'.repeat(1001);

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      expect(quoteErrors).toHaveLength(1);
      expect(quoteErrors[0].constraints?.maxLength).toBeDefined();
      expect(quoteErrors[0].constraints?.maxLength).toContain('1000');
    });

    it('should pass validation when quote is only whitespace (trimmed by service)', async () => {
      dto.quote = '   ';

      const errors = await validate(dto);
      const quoteErrors = errors.filter(error => error.property === 'quote');
      
      // @IsNotEmpty() doesn't consider whitespace-only strings as empty
      // The service layer handles trimming, so this is valid input
      expect(quoteErrors).toHaveLength(0);
    });
  });

  describe('author field (optional)', () => {
    it('should pass validation with valid author', async () => {
      dto.author = 'Updated Author';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should pass validation when author is undefined (optional field)', async () => {
      // author is undefined

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should pass validation when author is null (optional field)', async () => {
      dto.author = null as any;

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should fail validation when author is empty string', async () => {
      dto.author = '';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when author is not a string', async () => {
      (dto as any).author = 123;

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with author at maximum length (200 characters)', async () => {
      dto.author = 'A'.repeat(200);

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(0);
    });

    it('should fail validation when author exceeds maximum length (201 characters)', async () => {
      dto.author = 'A'.repeat(201);

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      expect(authorErrors).toHaveLength(1);
      expect(authorErrors[0].constraints?.maxLength).toBeDefined();
      expect(authorErrors[0].constraints?.maxLength).toContain('200');
    });

    it('should pass validation when author is only whitespace (trimmed by service)', async () => {
      dto.author = '   ';

      const errors = await validate(dto);
      const authorErrors = errors.filter(error => error.property === 'author');
      
      // @IsNotEmpty() doesn't consider whitespace-only strings as empty
      // The service layer handles trimming, so this is valid input
      expect(authorErrors).toHaveLength(0);
    });
  });

  describe('tags field (optional)', () => {
    it('should pass validation with valid tags', async () => {
      dto.tags = 'updated;tags;here';

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is undefined (optional field)', async () => {
      // tags is undefined

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is null (optional field)', async () => {
      dto.tags = null as any;

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should pass validation when tags is empty string', async () => {
      dto.tags = '';

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should fail validation when tags is not a string', async () => {
      (dto as any).tags = 123;

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(1);
      expect(tagsErrors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation with tags at maximum length (500 characters)', async () => {
      dto.tags = 'A'.repeat(500);

      const errors = await validate(dto);
      const tagsErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagsErrors).toHaveLength(0);
    });

    it('should fail validation when tags exceeds maximum length (501 characters)', async () => {
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
      dto.quote = 'This is an updated quote.';
      dto.author = 'Updated Author';
      dto.tags = 'updated;tags';

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with no fields (all optional)', async () => {
      // All fields are undefined

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial fields', async () => {
      dto.quote = 'Only updating the quote.';
      // author and tags are undefined

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

    it('should pass validation with mixed valid and undefined fields', async () => {
      dto.quote = 'Only updating the quote.';
      dto.author = undefined;
      dto.tags = 'new;tags';

      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });
  });
});
