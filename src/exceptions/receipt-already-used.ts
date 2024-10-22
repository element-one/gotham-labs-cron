import { BadRequestException } from '@nestjs/common';

export class ReceiptAlreadyUsedException extends BadRequestException {
  constructor(error?: string) {
    super('error.receipt-already-used', error);
  }
}
