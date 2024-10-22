import { IsString } from 'class-validator';

import { UserEarnEntity } from '@entities/user-earn.entity';

export class WarrentReceiptResponseDto {
  @IsString()
  userEarns: UserEarnEntity[];
}
