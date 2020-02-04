import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: null })
  cover: string; // 封面图

  @Column({ type: 'text', default: null })
  summary: string; // 摘要，自动生成

  @Column({ type: 'text', default: null })
  content: string; // 原始内容

  @Column({ type: 'text', default: null })
  html: string; // 格式化内容，自动生成

  @Column({ type: 'text', default: null })
  toc: string; // 格式化内容索引，自动生成

  @ManyToMany(
    () => Tag,
    tag => tag.articles,
    { cascade: true }
  )
  @JoinTable()
  tags: Array<Tag>;

  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // 文章状态

  @Column({ type: 'int', default: 0 })
  views: number; // 阅读量

  @Column({ type: 'text', default: null, select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  needPassword: boolean;

  @Column({ type: 'boolean', default: true })
  isCommentable: boolean;

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
