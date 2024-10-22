import { BadRequestException } from '@nestjs/common';

export class ExceededMaxTimesException extends BadRequestException {
  constructor(error?: string) {
    super('error.exceeded-max-times', error);
  }
}
