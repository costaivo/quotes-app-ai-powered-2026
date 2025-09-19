import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validation constraint that prevents semicolons in tag values.
 * 
 * This validator enforces the semicolon policy for tags:
 * - Semicolons are not allowed in tag values to prevent confusion with tag separation
 * - Users should use separate tags instead of semicolon-separated values
 * - This helps maintain consistency with the tag normalization system
 * 
 * The validation allows null, undefined, and empty string values (handled by other validators).
 */
@ValidatorConstraint({ async: false, name: 'noSemicolon' })
export class NoSemicolonConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // If value is null, undefined, or empty string, it's valid (optional field)
    if (value == null || value === '') {
      return true;
    }

    // Check if value is a string and doesn't contain semicolons
    if (typeof value === 'string') {
      return !value.includes(';');
    }

    // If it's not a string, it's invalid (should be handled by @IsString decorator)
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Tag values cannot contain semicolons (;). Use separate tags instead.';
  }
}

export function NoSemicolon(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoSemicolonConstraint,
    });
  };
}
