import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PostDataEntity } from '@entities/post-data.entity';

@Injectable()
export class PostDataRepository extends Repository<PostDataEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostDataEntity, dataSource.createEntityManager());
  }
}
