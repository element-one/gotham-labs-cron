import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostDataEntity } from '@entities/post-data.entity';

import { PostDataRepository } from './post-data.repository';
import { PostDataService } from './post-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostDataEntity]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [],
  providers: [PostDataService, PostDataRepository],
  exports: [PostDataService],
})
export class PostDataModule {}
