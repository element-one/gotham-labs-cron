import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { UserEarnEntity } from '@entities/user-earn.entity';
import { EarnEnum } from '@type/enum';

import { CreateUserEarnDto } from './dto/create-user-earn.dto';
import { UserEarnRepository } from './user-earn.repository';

@Injectable()
export class UserEarnService {
  constructor(
    private readonly userEarnRepository: UserEarnRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getById(id: string): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findById(id);
  }

  async createUserEarn(dto: CreateUserEarnDto): Promise<UserEarnEntity> {
    return await this.userEarnRepository.createUserEarn(dto);
  }

  async saveUserEarn(userEarn: UserEarnEntity): Promise<UserEarnEntity> {
    return await this.userEarnRepository.save(userEarn);
  }

  async getByUserIdAndEarnId(
    userId: string,
    earnId: string,
  ): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findByUserIdAndEarnId(userId, earnId);
  }

  async getByEarnIdAndReceiptId(
    earnId: string,
    userReceiptId: string,
  ): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findByEarnIdAndReceiptId(
      earnId,
      userReceiptId,
    );
  }

  async getByReceiptId(userReceiptId: string): Promise<UserEarnEntity> {
    return await this.userEarnRepository.findByReceiptId(userReceiptId);
  }

  async getCountByUserIdAndEarnId(
    userId: string,
    earnId: string,
  ): Promise<number> {
    return await this.userEarnRepository.getCountByUserIdAndEarnId(
      userId,
      earnId,
    );
  }

  async getByUserId(userId: string): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findByUserId(userId);
  }

  async getUnAirdropEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findUnAirdropped();
  }

  async getAttemptedAirdropEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findAttemptedAirdropped();
  }

  async updateSurveyAnswers(userEarn: UserEarnEntity): Promise<UserEarnEntity> {
    return await this.userEarnRepository.save(userEarn);
  }

  async getPendingEarns(): Promise<UserEarnEntity[]> {
    return await this.userEarnRepository.findPending();
  }

  async getWarrantyReceipts(userId: string): Promise<UserEarnEntity[]> {
    const queryBuilder = this.userEarnRepository.createQueryBuilder('userEarn');

    queryBuilder
      .leftJoinAndSelect('userEarn.earn', 'earn')
      .leftJoinAndSelect('userEarn.userReceipt', 'userReceipt')
      .orderBy('userEarn.createdAt', 'DESC')
      .where('userEarn.userId = :userId and earn.type = :type', {
        userId,
        type: EarnEnum.WARRANTY,
      });

    const userEarns = await queryBuilder.getMany();
    return userEarns;
  }

  @Cron('*/3 * * * *')
  async uploadPhoneInfoToRiseServer() {
    const queryBuilder = this.userEarnRepository.createQueryBuilder('userEarn');
    queryBuilder
      .where(
        'userEarn.needToUpload = true AND userEarn.isClaimed = true AND userEarn.uploadErrorTimes < 3',
      )
      .orderBy('userEarn.createdAt', 'ASC')
      .limit(200);

    const userEarns = await queryBuilder.getMany();
    if (userEarns.length === 0) {
      return;
    }

    console.log(
      `${new Date().toISOString()} It will be upload ${
        userEarns.length
      } records.`,
    );

    const endpoint = this.configService.get('RISE_SERVER_ENDPOINT');
    for (const userEarn of userEarns) {
      try {
        const { firstName, lastName, email, zip, dateOfBirth, phone } =
          userEarn.answers;

        if (!this.isValidNumberString(zip.toString(), 5)) {
          await this.userEarnRepository.update(userEarn.id, {
            uploadErrorTimes: 4,
          });
          continue;
        }

        if (!this.isValidNumberString(dateOfBirth.toString(), 8)) {
          await this.userEarnRepository.update(userEarn.id, {
            uploadErrorTimes: 5,
          });
          continue;
        }

        if (!this.isValidNumberString(phone.toString(), 10)) {
          await this.userEarnRepository.update(userEarn.id, {
            uploadErrorTimes: 6,
          });
          continue;
        }

        const response = await this.httpService.axiosRef.post(
          endpoint,
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
          await this.userEarnRepository.update(userEarn.id, {
            needToUpload: false,
          });
        } else {
          await this.userEarnRepository.update(userEarn.id, {
            uploadErrorTimes: userEarn.uploadErrorTimes + 1,
          });
        }

        await this.sleep(200);
      } catch (err) {
        console.log(err.message);
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
