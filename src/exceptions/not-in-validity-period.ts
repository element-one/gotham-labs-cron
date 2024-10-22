import { BadRequestException } from '@nestjs/common';

export class NotInValidityPeriodException extends BadRequestException {
  constructor(error?: string) {
    super('error.not-in-validity-period', error);
  }
}
