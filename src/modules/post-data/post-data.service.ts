import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { PostDataRepository } from './post-data.repository';

@Injectable()
export class PostDataService {
  constructor(
    private readonly postDataRepository: PostDataRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Cron('*/3 * * * *')
  async uploadPhoneInfoToRiseServer() {
    const queryBuilder = this.postDataRepository.createQueryBuilder('postData');
    queryBuilder
      .where(
        'postData.isUploaded = false AND postData.isClaimed = true AND postData.uploadErrorTimes < 3',
      )
      .orderBy('postData.createdAt', 'ASC')
      .limit(200);

    const posts = await queryBuilder.getMany();
    if (posts.length === 0) {
      return;
    }

    console.log(
      `${new Date().toISOString()} It will be upload ${posts.length} records.`,
    );

    const endpointUrl = this.configService.get('RISE_SERVER_ENDPOINT');
    for (const post of posts) {
      try {
        const { firstName, lastName, email, zip, dateOfBirth, phone } =
          post.data;

        if (!this.isValidNumberString(zip.toString(), 5)) {
          await this.postDataRepository.update(post.id, {
            uploadErrorTimes: 4,
          });
          continue;
        }

        if (!this.isValidNumberString(dateOfBirth.toString(), 8)) {
          await this.postDataRepository.update(post.id, {
            uploadErrorTimes: 5,
          });
          continue;
        }

        if (!this.isValidNumberString(phone.toString(), 10)) {
          await this.postDataRepository.update(post.id, {
            uploadErrorTimes: 6,
          });
          continue;
        }

        const response = await this.httpService.axiosRef.post(
          endpointUrl,
          {
            firstName,
            lastName,
            email,
            zip,
            dateOfBirth,
            phone,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200) {
          await this.postDataRepository.update(post.id, {
            isUploaded: true,
          });
        } else {
          await this.postDataRepository.update(post.id, {
            uploadErrorTimes: post.uploadErrorTimes + 1,
          });
        }

        await this.sleep(100);
      } catch (err) {
        console.log(err.message);
        await this.postDataRepository.update(post.id, {
          uploadErrorTimes: post.uploadErrorTimes + 1,
          errorMsg: err.message,
        });
      }
    }

    console.log(`${new Date().toISOString()} Upload completed.`);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isValidNumberString(value: string, length: number): boolean {
    const regex = new RegExp(`^\\d{${length}}$`);
    return regex.test(value);
  }
}
