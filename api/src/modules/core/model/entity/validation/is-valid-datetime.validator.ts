import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'isValidDateTime', async: false })
export class IsValidDateTime implements ValidatorConstraintInterface {
  validate(value: DateTime) {
    return value.isValid;
  }
}
