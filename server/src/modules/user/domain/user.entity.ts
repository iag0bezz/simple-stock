import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
export class UserModel {
  @PrimaryColumn('text')
  @ApiProperty()
  id: string;

  @Column('text', { unique: true })
  @ApiProperty({ uniqueItems: true })
  email: string;

  @Column('text', { select: false })
  @ApiProperty()
  password: string;

  @Column()
  @CreateDateColumn()
  @ApiProperty({ example: 'date' })
  date: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid().replace(/-/g, '');
    this.email = this.email.toLowerCase();
  }
}
