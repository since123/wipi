import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  articleId: string; // 关联文章 id

  @Column({ default: null })
  parentCommentId: string; // 父级评论 id

  @Column()
  contact: string; // 联系方式

  @Column({ type: 'text', default: null }) // 评论内容
  content: string;

  @Column({ type: 'text', default: null }) // 评论内容
  html: string;

  @Column({ type: 'boolean', default: false })
  pass: boolean; // 是否审核通过

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
