import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/shared/base-entity';
import { Column, Entity } from 'typeorm';

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
}
