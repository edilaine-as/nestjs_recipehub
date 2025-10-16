import { InjectRepository } from '@nestjs/typeorm'
import { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { RecipeOrmEntity } from '../entities/recipe.orm-entity'
import { Recipe } from '../../domain/entities/recipe.entity'
import { Repository } from 'typeorm'

export class RecipeRepositoryImpl
  implements RecipeRepository
{
  constructor(
    @InjectRepository(RecipeOrmEntity)
    private readonly ormRepo: Repository<RecipeOrmEntity>,
  ) {}

  async save(
    recipe: Recipe,
  ): Promise<void> {
    const entity =
      this.toOrmEntity(recipe)
    await this.ormRepo.save(entity)
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.ormRepo.delete(id)
  }

  async findById(
    id: string,
  ): Promise<Recipe | null> {
    const entity =
      await this.ormRepo.findOne({
        where: { id },
      })
    return entity
      ? Recipe.restore({
          id: entity.id,
          title: entity.title,
          category: entity.category,
          userId: entity.userId,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })
      : null
  }

  async findAll(): Promise<Recipe[]> {
    const entities =
      await this.ormRepo.find()

    return entities.map((entity) =>
      Recipe.restore({
        id: entity.id,
        title: entity.title,
        category: entity.category,
        userId: entity.userId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }),
    )
  }

  private toOrmEntity(
    domain: Recipe,
  ): RecipeOrmEntity {
    return {
      id: domain.getId(),
      title: domain.getTitle(),
      category: domain.getCategory(),
      userId: domain.getUserId(),
      createdAt: domain.getCreatedAt(),
      updatedAt: domain.getUpdatedAt(),
    }
  }
}
