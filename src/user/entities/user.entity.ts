import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

type UserStatus = 'active' | 'inactive' | 'suspended';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  surename: string;

  @Column({ type: 'varchar', nullable: true })
  status: UserStatus;

  @Column({ type: 'varchar', nullable: true })
  birthday: string;

  @Column({ type: 'json', nullable: true })
  people_data: {
    followersCount?: number;
    followingCount?: number;
    visitorCount?: number;
  };

  @Column({ type: 'json', nullable: true })
  contact: {
    phone?: string;
    insta?: string;
    facebook?: string;
    telegram?: string;
    viber?: string;
    whatsapp?: string;
  };

  @Column({ type: 'json', nullable: true })
  image: {
    profile?: string;
    wallpaper?: string;
  };

  @Column({ type: 'json', nullable: true })
  profession: {
    label?: string;
    value?: string;
  };

  @Column({ type: 'json', nullable: true })
  scope: {
    voice?: number;
    value?: number;
  };

  @Column({ type: 'json', nullable: true })
  worked_country: object;

  @Column({ type: 'json', nullable: true })
  country_of_live: object;

  @Column({ type: 'json', nullable: true })
  spoken_language: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
