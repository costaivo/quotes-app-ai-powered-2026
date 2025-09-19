import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validation constraint that sanitizes tag input to prevent malformed data.
 * 
 * This validator enforces tag sanitization rules:
 * - Prevents control characters (except common whitespace: space, tab, newline)
 * - Prevents excessive whitespace (more than 2 consecutive spaces, tabs, or newlines)
 * - Prevents problematic characters that could cause issues in tag processing
 * - Allows normal letters, numbers, spaces, and common punctuation
 * 
 * The validation allows null, undefined, and empty string values (handled by other validators).
 * 
 * @see sanitizeTagString - Utility function that performs the actual sanitization
 */
@ValidatorConstraint({ async: false, name: 'tagSanitization' })
export class TagSanitizationConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // If value is null, undefined, or empty string, it's valid (optional field)
    if (value == null || value === '') {
      return true;
    }

    // Check if value is a string
    if (typeof value !== 'string') {
      return false;
    }

    // Check for control characters (except common whitespace: space, tab, newline)
    const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
    if (controlCharRegex.test(value)) {
      return false;
    }

    // Check for excessive whitespace (more than 2 consecutive spaces)
    const excessiveWhitespaceRegex = / {3,}|\t{2,}|\n{2,}|\r{2,}/;
    if (excessiveWhitespaceRegex.test(value)) {
      return false;
    }

    // Check for potentially problematic characters
    const problematicCharsRegex = /[<>{}[\]\\|`~]/;
    if (problematicCharsRegex.test(value)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Tag values contain invalid characters. Please use only letters, numbers, spaces, and common punctuation.';
  }
}

export function TagSanitization(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TagSanitizationConstraint,
    });
  };
}

/**
 * Sanitizes tag strings to ensure clean, consistent input for tag processing.
 * 
 * This utility function performs comprehensive sanitization:
 * 1. Unicode normalization (NFD) to handle accented characters consistently
 * 2. Removal of diacritical marks (accents) to prevent duplicate tags
 * 3. Removal of control characters that could cause processing issues
 * 4. Replacement of tabs and newlines with spaces for consistency
 * 5. Collapsing of multiple consecutive spaces into single spaces
 * 6. Trimming of leading and trailing whitespace
 * 
 * @param input - The tag string to sanitize
 * @returns The sanitized tag string, or empty string if input is invalid
 * 
 * @example
 * sanitizeTagString('  INSPIRATION\t\n  ') // Returns 'INSPIRATION'
 * sanitizeTagString('café naïve') // Returns 'cafe naive'
 * sanitizeTagString('tag1   tag2') // Returns 'tag1 tag2'
 */
export function sanitizeTagString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Normalize Unicode characters (NFD normalization to handle accented characters properly)
    .normalize('NFD')
    // Remove diacritical marks (accents) by keeping only base characters
    .replace(/[\u0300-\u036f]/g, '')
    // Remove control characters (keep only printable characters and common whitespace)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace tabs and newlines with spaces
    .replace(/[\t\n\r]/g, ' ')
    // Collapse multiple consecutive spaces into single space
    .replace(/ {2,}/g, ' ')
    // Trim leading and trailing whitespace
    .trim();
}
