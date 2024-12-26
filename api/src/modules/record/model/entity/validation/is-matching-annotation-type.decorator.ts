import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import {
  AnnotationType,
  AnnotationTypeEnum,
} from '../../value-object/annotation-type.vo';

@ValidatorConstraint({ name: 'isMatchingAnnotationType', async: false })
export class IsMatchingAnnotationType implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { type } = args.object as { type: AnnotationType };

    switch (type.type) {
      case AnnotationTypeEnum.TRANSCRIPT:
        return typeof value === 'string';
      case AnnotationTypeEnum.SPEAKER:
        return typeof value === 'string';
      case AnnotationTypeEnum.CONFIDENCE:
        return typeof value === 'number';
      default:
        return false;
    }
  }
}
