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
    private readonly recipeOrmRepo: Repository<RecipeOrmEntity>,
    @InjectRepository(
      RecipeIngredientOrmEntity,
    )
    private readonly recipeIngredientOrmRepo: Repository<RecipeIngredientOrmEntity>,
    @InjectRepository(
      RecipeStepOrmEntity,
    )
    private readonly recipeStepOrmRepo: Repository<RecipeStepOrmEntity>,
  ) {}

  async save(
    recipe: Recipe,
  ): Promise<void> {
    const entity =
      this.toOrmEntity(recipe)
    await this.recipeOrmRepo.save(
      entity,
    )
  }

  async saveRecipeIngredient(
    ingredient: RecipeIngredient,
  ): Promise<void> {
    const entity =
      this.toOrmRecipeIngredient(
        ingredient,
      )
    await this.recipeIngredientOrmRepo.save(
      entity,
    )
  }

  async saveRecipeStep(
    recipeStep: RecipeStep,
  ): Promise<void> {
    const entity =
      this.toOrmRecipeStep(recipeStep)

    await this.recipeStepOrmRepo.save(
      entity,
    )
  }

  async delete(
    id: string,
  ): Promise<void> {
    await this.recipeOrmRepo.delete(id)
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<Recipe | null> {
    const entity =
      await this.recipeOrmRepo.findOne({
        where: {
          id,
          user: { id: userId },
        },
        relations: [
          'user',
          'recipeSteps',
          'recipeSteps.recipe',
          'recipeIngredients',
          'recipeIngredients.ingredient',
          'recipeIngredients.recipe',
        ],
      })

    if (!entity) {
      return null
    }

    return this.toDomainEntity(entity)
  }

  async findAll(
    userId: string,
  ): Promise<Recipe[]> {
    const entities =
      await this.recipeOrmRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        relations: [
          'user',
          'recipeSteps',
          'recipeSteps.recipe',
          'recipeIngredients',
          'recipeIngredients.ingredient',
          'recipeIngredients.recipe',
        ],
      })
    return entities.map((entity) =>
      this.toDomainEntity(entity),
    )
  }

  async findRecipeIngredientById(
    id: string,
    userId: string,
  ) {
    const entity =
      await this.recipeIngredientOrmRepo.findOne(
        {
          where: {
            id,
            recipe: {
              user: { id: userId },
            },
          },
          relations: [
            'ingredient',
            'recipe',
          ],
        },
      )

    if (!entity) {
      return null
    }

    return this.toDomainEntityRecipeIngredient(
      entity,
    )
  }

  async hasRecipeIngredientById(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ) {
    const entity =
      await this.recipeIngredientOrmRepo.findOne(
        {
          where: {
            recipe: {
              id: recipeId,
              user: { id: userId },
            },
            ingredient: {
              id: ingredientId,
            },
          },
        },
      )

    if (!entity) {
      return false
    }

    return true
  }

  async hasRecipeIngredientByName(
    recipeId: string,
    name: string,
    userId: string,
  ) {
    const entity =
      await this.recipeIngredientOrmRepo.findOne(
        {
          where: {
            recipe: {
              id: recipeId,
              user: { id: userId },
            },
            ingredient: {
              name: name,
            },
          },
        },
      )

    if (!entity) {
      return false
    }

    return true
  }

  async findRecipeStepById(
    id: string,
    userId: string,
  ) {
    const entity =
      await this.recipeStepOrmRepo.findOne(
        {
          where: {
            id,
            recipe: {
              user: { id: userId },
            },
          },
          relations: ['recipe'],
        },
      )

    if (!entity) {
      return null
    }

    return this.toDomainEntityRecipeStep(
      entity,
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
        recipeIngredientsOrm.unit =
          ri.getUnit()
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

  private toOrmRecipeIngredient(
    recipeIngredient: RecipeIngredient,
  ) {
    const ingredientOrm =
      new IngredientOrmEntity()
    const ingredient =
      recipeIngredient.getIngredient()

    ingredientOrm.id =
      ingredient.getId()
    ingredientOrm.name =
      ingredient.getName()
    ingredientOrm.type =
      ingredient.getType()
    ingredientOrm.createdAt =
      ingredient.getCreatedAt()
    ingredientOrm.updatedAt =
      ingredient.getUpdatedAt()

    const recipeOrm =
      new RecipeOrmEntity()
    const recipe =
      recipeIngredient.getRecipe()

    recipeOrm.id = recipe.getId()
    recipeOrm.title = recipe.getTitle()
    recipeOrm.category =
      recipe.getCategory()
    recipeOrm.createdAt =
      recipe.getCreatedAt()
    recipeOrm.updatedAt =
      recipe.getUpdatedAt()

    const entity =
      new RecipeIngredientOrmEntity()

    entity.id = recipeIngredient.getId()
    entity.ingredient = ingredientOrm
    entity.recipe = recipeOrm
    entity.quantity =
      recipeIngredient.getQuantity()
    entity.unit =
      recipeIngredient.getUnit()
    entity.createdAt =
      recipeIngredient.getCreatedAt()
    entity.updatedAt =
      recipeIngredient.getUpdatedAt()

    return entity
  }

  private toOrmRecipeStep(
    recipeStep: RecipeStep,
  ) {
    const recipeOrm =
      new RecipeOrmEntity()
    const recipe =
      recipeStep.getRecipe()

    recipeOrm.id = recipe.getId()
    recipeOrm.title = recipe.getTitle()
    recipeOrm.category =
      recipe.getCategory()
    recipeOrm.createdAt =
      recipe.getCreatedAt()
    recipeOrm.updatedAt =
      recipe.getUpdatedAt()

    const entity =
      new RecipeStepOrmEntity()

    entity.id = recipeStep.getId()
    entity.stepNumber =
      recipeStep.getStep()
    entity.description =
      recipeStep.getDescription()
    entity.recipe = recipeOrm
    entity.createdAt =
      recipeStep.getCreatedAt()
    entity.updatedAt =
      recipeStep.getUpdatedAt()

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
          recipe: Recipe.restore({
            id: ri.recipe.id,
            title: ri.recipe.title,
            category:
              ri.recipe.category,
            userId:
              ri.recipe.user?.id ?? '',
            ingredients: [],
            steps: [],
            createdAt:
              ri.recipe.createdAt,
            updatedAt:
              ri.recipe.updatedAt,
          }),
          quantity: ri.quantity,
          unit: ri.unit,
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
        recipe: Recipe.restore({
          id: step.recipe.id,
          title: step.recipe.title,
          category:
            step.recipe.category,
          userId:
            step.recipe.user?.id ?? '',
          ingredients: [],
          steps: [],
          createdAt:
            step.recipe.createdAt,
          updatedAt:
            step.recipe.updatedAt,
        }),
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

  private toDomainEntityRecipeIngredient(
    entity: RecipeIngredientOrmEntity,
  ) {
    const ri = entity.ingredient
    const ingredient =
      Ingredient.restore({
        id: ri.id,
        name: ri.name,
        type: ri.type,
        userId: ri.user?.id ?? '',
        createdAt: ri.createdAt,
        updatedAt: ri.updatedAt,
      })

    const r = entity.recipe
    const recipe = Recipe.restore({
      id: r.id,
      title: r.title,
      category: r.category,
      userId: r.user?.id ?? '',
      ingredients: [],
      steps: [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })

    return RecipeIngredient.restore({
      id: entity.id,
      ingredient,
      recipe,
      quantity: entity.quantity,
      unit: entity.unit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toDomainEntityRecipeStep(
    entity: RecipeStepOrmEntity,
  ) {
    const r = entity.recipe

    const recipe = Recipe.restore({
      id: r.id,
      title: r.title,
      category: r.category,
      userId: r.user?.id ?? '',
      ingredients: [],
      steps: [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })

    return RecipeStep.restore({
      id: entity.id,
      step: entity.stepNumber,
      description: entity.description,
      recipe,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }
}
