import { Column, Entity } from 'typeorm';

import { JSONObject } from '@type/common';
import { AbstractEntity } from '@type/shared/abstract.entity';

@Entity({ name: 'post_data' })
export class PostDataEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true, default: false })
  userEarnId: string;

  @Column({ default: false })
  isClaimed: boolean;

  @Column({ default: false })
  isUploaded: boolean;

  @Column({ type: 'varchar', default: false })
  errorMsg: string;

  @Column({ type: 'int4', default: 0 })
  uploadErrorTimes: number;

  @Column('jsonb', { nullable: false, default: {} })
  data: JSONObject;
}
