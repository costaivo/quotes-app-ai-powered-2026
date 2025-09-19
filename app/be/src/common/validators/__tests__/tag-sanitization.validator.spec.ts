import { validate } from 'class-validator';
import { TagSanitization, sanitizeTagString } from '../tag-sanitization.validator';

class TestDto {
  @TagSanitization()
  tags?: string;
}

describe('TagSanitizationValidator', () => {
  let dto: TestDto;

  beforeEach(() => {
    dto = new TestDto();
  });

  describe('valid cases', () => {
    it('should pass validation when tags field is undefined', async () => {
      // tags is undefined
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation when tags field is null', async () => {
      dto.tags = null as any;
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation when tags field is empty string', async () => {
      dto.tags = '';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with normal tag content', async () => {
      dto.tags = 'inspiration motivation success';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with common punctuation', async () => {
      dto.tags = 'self-improvement, life-lessons, success!';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with numbers and letters', async () => {
      dto.tags = '2024 goals new-year resolution';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with accented characters', async () => {
      dto.tags = 'café naïve résumé';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with single spaces', async () => {
      dto.tags = 'tag1 tag2 tag3';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation with single tab or newline', async () => {
      dto.tags = 'tag1\ttag2\ntag3';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });
  });

  describe('invalid cases', () => {
    it('should fail validation with control characters', async () => {
      dto.tags = 'tag1\x00tag2'; // NULL character
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with excessive spaces', async () => {
      dto.tags = 'tag1   tag2'; // 3+ consecutive spaces
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with excessive tabs', async () => {
      dto.tags = 'tag1\t\ttag2'; // 2+ consecutive tabs
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with excessive newlines', async () => {
      dto.tags = 'tag1\n\ntag2'; // 2+ consecutive newlines
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with angle brackets', async () => {
      dto.tags = 'tag1<tag2>tag3';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with curly braces', async () => {
      dto.tags = 'tag1{tag2}tag3';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with square brackets', async () => {
      dto.tags = 'tag1[tag2]tag3';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with backslashes', async () => {
      dto.tags = 'tag1\\tag2';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with pipes', async () => {
      dto.tags = 'tag1|tag2';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with backticks', async () => {
      dto.tags = 'tag1`tag2';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation with tildes', async () => {
      dto.tags = 'tag1~tag2';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });

    it('should fail validation when not a string', async () => {
      dto.tags = 123 as any;
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.tagSanitization).toBeDefined();
    });
  });

  describe('error message', () => {
    it('should return the correct error message', async () => {
      dto.tags = 'tag1<tag2';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors[0].constraints?.tagSanitization).toBe(
        'Tag values contain invalid characters. Please use only letters, numbers, spaces, and common punctuation.'
      );
    });
  });
});

describe('sanitizeTagString function', () => {
  describe('valid inputs', () => {
    it('should return empty string for null input', () => {
      expect(sanitizeTagString(null as any)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(sanitizeTagString(undefined as any)).toBe('');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeTagString(123 as any)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(sanitizeTagString('')).toBe('');
    });

    it('should return the same string for valid input', () => {
      expect(sanitizeTagString('inspiration motivation')).toBe('inspiration motivation');
    });

    it('should normalize accented characters', () => {
      expect(sanitizeTagString('café naïve')).toBe('cafe naive');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(sanitizeTagString('  inspiration  ')).toBe('inspiration');
    });
  });

  describe('sanitization', () => {
    it('should remove control characters', () => {
      expect(sanitizeTagString('tag1\x00tag2')).toBe('tag1tag2');
    });

    it('should replace tabs and newlines with spaces', () => {
      expect(sanitizeTagString('tag1\ttag2\ntag3')).toBe('tag1 tag2 tag3');
    });

    it('should collapse multiple spaces into single space', () => {
      expect(sanitizeTagString('tag1   tag2    tag3')).toBe('tag1 tag2 tag3');
    });

    it('should handle mixed whitespace', () => {
      expect(sanitizeTagString('tag1\t\n  tag2')).toBe('tag1 tag2');
    });

    it('should handle complex sanitization', () => {
      const input = '  tag1\x00\t\n   tag2  ';
      const expected = 'tag1 tag2';
      expect(sanitizeTagString(input)).toBe(expected);
    });
  });
});
