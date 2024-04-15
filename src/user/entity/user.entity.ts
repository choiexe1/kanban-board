import { Exclude } from 'class-transformer';
import { Invite } from 'src/invite/entity/invite.entity';
import { BaseEntity } from 'src/shared/base-entity';
import { Team } from 'src/team/entities/team.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ length: 60 })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToOne(() => Team, (team) => team.leader, { nullable: true })
  lead: Team;

  @ManyToMany(() => Team, (team) => team.member)
  team: Team[];

  @OneToMany(() => Invite, (invite) => invite.id, {
    cascade: true,
  })
  invites: Invite[];
}
