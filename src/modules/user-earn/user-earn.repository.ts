import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEarnEntity } from '@entities/user-earn.entity';

@Injectable()
export class UserEarnRepository extends Repository<UserEarnEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEarnEntity, dataSource.createEntityManager());
  }
}
