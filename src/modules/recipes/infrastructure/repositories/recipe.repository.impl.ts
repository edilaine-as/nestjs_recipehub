import { InjectRepository } from '@nestjs/typeorm'
import { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { RecipeOrmEntity } from '../entities/recipe.orm-entity'
import { Recipe } from '../../domain/entities/recipe.entity'
import { Repository } from 'typeorm'
import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import { RecipeIngredient } from '../../domain/entities/recipe-ingredient.entity'
import { RecipeIngredientOrmEntity } from '../entities/recipe-ingredient.orm-entity'
import { IngredientOrmEntity } from 'src/modules/ingredients/infrastructure/entities/ingredient.orm-entity'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'
import { RecipeStep } from '../../domain/entities/recipe-step.entity'
import { RecipeStepOrmEntity } from '../entities/recipe-step.orm-entity'

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
        relations: [
          'user',
          'recipeIngredients',
          'recipeSteps',
          'recipeIngredients.ingredient',
        ],
      })

    if (!entity) {
      return null
    }

    return this.toDomainEntity(entity)
  }

  async findAllByUserId(
    userId: string,
  ): Promise<Recipe[]> {
    const entities =
      await this.ormRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        relations: [
          'user',
          'recipeIngredients',
          'recipeSteps',
          'recipeIngredients.ingredient',
        ],
      })
    return entities.map((entity) =>
      this.toDomainEntity(entity),
    )
  }

  private toOrmEntity(
    recipe: Recipe,
  ): RecipeOrmEntity {
    const user = new UserOrmEntity()
    user.id = recipe.getUserId()

    const entity = new RecipeOrmEntity()
    entity.id = recipe.getId()
    entity.title = recipe.getTitle()
    entity.category =
      recipe.getCategory()
    entity.user = user
    entity.createdAt =
      recipe.getCreatedAt()
    entity.updatedAt =
      recipe.getUpdatedAt()

    const recipeIngredients = recipe
      .getIngredients()
      .map((ri) => {
        const ingredientOrm =
          new IngredientOrmEntity()
        const ingredient =
          ri.getIngredient()

        ingredientOrm.id =
          ingredient.getId()
        ingredientOrm.name =
          ingredient.getName()
        ingredientOrm.type =
          ingredient.getType()
        ingredientOrm.user =
          new UserOrmEntity()
        ingredientOrm.user.id =
          ingredient.getUserId()
        ingredientOrm.createdAt =
          ingredient.getCreatedAt()
        ingredientOrm.updatedAt =
          ingredient.getUpdatedAt()

        const recipeIngredientsOrm =
          new RecipeIngredientOrmEntity()
        recipeIngredientsOrm.id =
          ri.getId()
        recipeIngredientsOrm.ingredient =
          ingredientOrm
        recipeIngredientsOrm.quantity =
          ri.getQuantity()
        recipeIngredientsOrm.createdAt =
          ri.getCreatedAt()
        recipeIngredientsOrm.updatedAt =
          ri.getUpdatedAt()
        recipeIngredientsOrm.recipe =
          entity

        return recipeIngredientsOrm
      })

    const steps = recipe
      .getSteps()
      .map((step) => {
        const recipeStepOrm =
          new RecipeStepOrmEntity()

        recipeStepOrm.id = step.getId()
        recipeStepOrm.stepNumber =
          step.getStep()
        recipeStepOrm.description =
          step.getDescription()
        recipeStepOrm.createdAt =
          step.getCreatedAt()
        recipeStepOrm.updatedAt =
          step.getUpdatedAt()
        recipeStepOrm.recipe = entity

        return recipeStepOrm
      })

    entity.recipeIngredients =
      recipeIngredients
    entity.recipeSteps = steps

    return entity
  }

  private toDomainEntity(
    entity: RecipeOrmEntity,
  ): Recipe {
    const ingredients: RecipeIngredient[] =
      (
        entity.recipeIngredients ?? []
      ).map((ri) =>
        RecipeIngredient.restore({
          id: ri.id,
          ingredient:
            Ingredient.restore({
              id: ri.ingredient.id,
              name: ri.ingredient.name,
              type: ri.ingredient.type,
              userId:
                ri.ingredient.user
                  ?.id ?? '',
              createdAt:
                ri.ingredient.createdAt,
              updatedAt:
                ri.ingredient.updatedAt,
            }),
          quantity: ri.quantity,
          createdAt: ri.createdAt,
          updatedAt: ri.updatedAt,
        }),
      )

    const steps: RecipeStep[] = (
      entity.recipeSteps ?? []
    ).map((step) =>
      RecipeStep.restore({
        id: step.id,
        step: step.stepNumber,
        description: step.description,
        createdAt: step.createdAt,
        updatedAt: step.updatedAt,
      }),
    )

    return Recipe.restore({
      id: entity.id,
      title: entity.title,
      category: entity.category,
      userId: entity.user?.id ?? '',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ingredients,
      steps,
    })
  }
}
