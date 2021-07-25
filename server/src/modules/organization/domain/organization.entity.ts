import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/modules/user/domain/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrganizationImageModel } from '../submodules/image/domain/image.entity';
import { v4 as uuid } from 'uuid';

@Entity('organizations')
export class OrganizationModel {
  @PrimaryColumn('text')
  @ApiProperty()
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  userId: string;

  @ManyToOne(() => UserModel, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: Promise<UserModel>;

  @OneToOne(() => OrganizationImageModel, (image) => image.organization, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  image: Promise<OrganizationImageModel>;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid().replace(/-/g, '');
  }
}
