import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/modules/users/domain/entities/user.entity'
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository'
import { UserOrmEntity } from '../entities/user.orm-entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserRepositoryImpl
  implements UserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  async save(
    user: User,
  ): Promise<void> {
    const entity =
      this.toOrmEntity(user)
    await this.ormRepo.save(entity)
  }

  async findById(
    id: string,
  ): Promise<User | null> {
    const entity =
      await this.ormRepo.findOne({
        where: { id },
      })

    return entity
      ? User.restore({
          id: entity.id,
          name: entity.name,
          email: entity.email,
          passwordHash: entity.password,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })
      : null
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const entity =
      await this.ormRepo.findOne({
        where: { email },
      })

    return entity
      ? User.restore({
          id: entity.id,
          name: entity.name,
          email: entity.email,
          passwordHash: entity.password,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })
      : null
  }

  async findAll(): Promise<User[]> {
    const entities =
      await this.ormRepo.find()

    return entities.map((entity) =>
      User.restore({
        id: entity.id,
        name: entity.name,
        email: entity.email,
        passwordHash: entity.password,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    )
  }

  private toOrmEntity(
    domain: User,
  ): UserOrmEntity {
    return {
      id: domain.getId(),
      name: domain.getName(),
      email: domain.getEmail(),
      password: domain.getPassword(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
    }
  }
}
