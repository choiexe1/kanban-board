import { Invite } from 'src/invite/entity/invite.entity';
import { BaseEntity } from 'src/shared/base-entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Team extends BaseEntity {
  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.lead, {
    cascade: true,
  })
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @ManyToMany(() => User, (user) => user.team, {
    cascade: true,
  })
  @JoinTable({ name: 'member' })
  member: User[];

  @OneToMany(() => Invite, (invite) => invite.team, {
    cascade: true,
  })
  invites: Invite[];
}
