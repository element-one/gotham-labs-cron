import { Injectable } from '@nestjs/common';

import { UserEarnEntity } from '@entities/user-earn.entity';
import { EarnEnum } from '@type/enum';

import { CreateUserEarnDto } from './dto/create-user-earn.dto';
import { UserEarnRepository } from './user-earn.repository';

@Injectable()
export class UserEarnService {
  constructor(private readonly userEarnRepository: UserEarnRepository) {}

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
}
