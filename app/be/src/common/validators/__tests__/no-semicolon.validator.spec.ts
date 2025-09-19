import { validate } from 'class-validator';
import { NoSemicolon } from '../no-semicolon.validator';

class TestDto {
  @NoSemicolon()
  tags?: string;
}

describe('NoSemicolonValidator', () => {
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

    it('should pass validation when tags field contains no semicolons', async () => {
      dto.tags = 'inspiration motivation success';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation when tags field contains other special characters but no semicolons', async () => {
      dto.tags = 'inspiration, motivation, success!';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });

    it('should pass validation when tags field contains spaces and hyphens', async () => {
      dto.tags = 'self-improvement life-lessons';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(0);
    });
  });

  describe('invalid cases', () => {
    it('should fail validation when tags field contains a single semicolon', async () => {
      dto.tags = 'inspiration;motivation';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
      expect(tagErrors[0].constraints?.noSemicolon).toContain('semicolons');
    });

    it('should fail validation when tags field contains multiple semicolons', async () => {
      dto.tags = 'inspiration;motivation;success';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });

    it('should fail validation when tags field starts with semicolon', async () => {
      dto.tags = ';inspiration';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });

    it('should fail validation when tags field ends with semicolon', async () => {
      dto.tags = 'inspiration;';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });

    it('should fail validation when tags field contains only semicolons', async () => {
      dto.tags = ';;;';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });

    it('should fail validation when tags field contains semicolon with spaces', async () => {
      dto.tags = 'inspiration ; motivation';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });

    it('should fail validation when tags field is not a string', async () => {
      dto.tags = 123 as any;
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors).toHaveLength(1);
      expect(tagErrors[0].constraints?.noSemicolon).toBeDefined();
    });
  });

  describe('error message', () => {
    it('should return the correct error message', async () => {
      dto.tags = 'inspiration;motivation';
      const errors = await validate(dto);
      const tagErrors = errors.filter(error => error.property === 'tags');
      
      expect(tagErrors[0].constraints?.noSemicolon).toBe(
        'Tag values cannot contain semicolons (;). Use separate tags instead.'
      );
    });
  });
});
