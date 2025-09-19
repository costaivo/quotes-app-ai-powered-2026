import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

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
 * Sanitizes tag strings by:
 * 1. Normalizing Unicode characters
 * 2. Removing control characters
 * 3. Collapsing excessive whitespace
 * 4. Trimming leading/trailing whitespace
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
