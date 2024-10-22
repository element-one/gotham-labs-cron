import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '@type/shared/abstract.entity';

import { BrandEntity } from './brand.entity';

@Entity({ name: 'brand_keywords' })
export class BrandKeywordsEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  keywords: string;

  @OneToOne(() => BrandEntity, (brand) => brand.brandKeywords)
  @JoinColumn()
  brand: BrandEntity;
}
