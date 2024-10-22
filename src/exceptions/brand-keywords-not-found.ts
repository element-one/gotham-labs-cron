import { BadRequestException } from '@nestjs/common';

export class BrandKeywordsNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.brand-keywords-not-found', error);
  }
}
