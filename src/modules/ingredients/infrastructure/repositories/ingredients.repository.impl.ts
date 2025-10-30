import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientRepository } from '../../domain/repositories/ingredients.repository'
import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import { IngredientOrmEntity } from '../entities/ingredient.orm-entity'

export class IngredientRepositoryImpl
  implements IngredientRepository
{
  constructor(
    @InjectRepository(
      IngredientOrmEntity,
    )
    private readonly ormRepo: Repository<IngredientOrmEntity>,
  ) {}

  async save(
    ingredient: Ingredient,
  ): Promise<void> {
    const entity =
      this.toOrmEntity(ingredient)
    await this.ormRepo.save(entity)
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.ormRepo.delete(id)
  }

  async findById(
    id: string,
  ): Promise<Ingredient | null> {
    const entity =
      await this.ormRepo.findOne({
        where: { id },
      })

    if (!entity) {
      return null
    }

    return this.toDomainEntity(entity)
  }

  async findAllByUserId(
    userId: string,
  ): Promise<Ingredient[]> {
    const entities =
      await this.ormRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      })

    return entities.map((entity) =>
      this.toDomainEntity(entity),
    )
  }

  private toOrmEntity(
    ingredient: Ingredient,
  ): IngredientOrmEntity {
    const user = new UserOrmEntity()

    const entity =
      new IngredientOrmEntity()
    entity.id = ingredient.getId()
    entity.name = ingredient.getName()
    entity.type = ingredient.getType()
    entity.user = user
    entity.createdAt =
      ingredient.getCreatedAt()
    entity.updatedAt =
      ingredient.getUpdatedAt()
    return entity
  }

  private toDomainEntity(
    entity: IngredientOrmEntity,
  ): Ingredient {
    return Ingredient.restore({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      userId: entity.user?.id ?? '',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }
}
