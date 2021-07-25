import { OrganizationModel } from 'src/modules/organization/domain/organization.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('organization_images')
export class OrganizationImageModel {
  @PrimaryColumn('text')
  id: string;

  @Column('bytea')
  file: Buffer;

  @Column('text')
  type: string;

  @Column()
  @CreateDateColumn()
  date: Date;

  url: string;

  @Column('text')
  organizationId: string;

  @OneToOne(() => OrganizationModel, (organization) => organization.image)
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<OrganizationModel>;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuid().replace(/-/g, '');
  }
}
