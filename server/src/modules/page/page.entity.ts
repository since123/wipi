import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // 页面名

  @Column()
  path: string; // 页面路径

  @Column({ type: 'text', default: null })
  content: string; // 原始内容

  @Column({ type: 'text', default: null })
  html: string; // 格式化内容，自动生成

  @Column({ type: 'text', default: null })
  toc: string; // 格式化内容索引，自动生成

  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // 页面状态

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // 发布日期

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
