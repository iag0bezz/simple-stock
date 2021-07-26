import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('tokens')
export class AuthTokenModel {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  token: string;

  @Column('text')
  userId: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid().replace(/-/g, '');
  }
}
