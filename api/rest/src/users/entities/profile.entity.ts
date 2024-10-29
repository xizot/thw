import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Profile extends CoreEntity {
  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Social, (address) => address.profile)
  socials: Social[];

  @Column({ nullable: true })
  contact: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  customer: User;
}

@Entity()
export class Social extends CoreEntity{
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  link: string;
  @ManyToOne(() => Profile, (profile) => profile.socials)
  @JoinColumn()
  profile: Profile;
}
