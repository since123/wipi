import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: null })
  systemTitle: string; // 系统标题

  @Column({ type: 'text', default: null })
  systemLogo: string; // 系统Logo

  @Column({ type: 'text', default: null })
  systemFavicon: string; // 系统 favicon

  @Column({ type: 'text', default: null })
  systemFooterInfo: string; // 系统页脚

  @Column({ type: 'text', default: null })
  seoKeyword: string; // SEO 关键词

  @Column({ type: 'text', default: null })
  seoDesc: string; // SEO 描述

  @Column({ type: 'text', default: null })
  ossRegion: string; // 阿里云 region

  @Column({ type: 'text', default: null })
  ossAccessKeyId: string; // 阿里云 accessKeyId

  @Column({ type: 'text', default: null })
  ossAccessKeySecret: string; // 阿里云  accessKeySecret

  @Column({ type: 'text', default: null })
  ossBucket: string; // 阿里云 bucket

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
