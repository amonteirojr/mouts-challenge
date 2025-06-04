import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User as DomainUser } from '../../../../domain/entities/user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDomain(domainUser: DomainUser): User {
    const user = new User();
    if (domainUser.getId()) {
      user.id = domainUser.getId();
    }
    user.name = domainUser.getName();
    user.email = domainUser.getEmail();
    user.password = domainUser.getPassword();
    user.createdAt = domainUser.getCreatedAt();
    user.updatedAt = domainUser.getUpdatedAt();
    return user;
  }

  toDomain(): DomainUser {
    return DomainUser.reconstitute(
      this.id,
      this.name,
      this.email,
      this.password,
      this.createdAt,
      this.updatedAt
    );
  }
} 