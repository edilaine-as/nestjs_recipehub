import {
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import type { IngredientRepository } from 'src/modules/ingredients/domain/repositories/ingredients.repository'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'

interface UpdateIngredientInput {
  ingredientId?: string // ingredient
  quantity?: number
  unit?: RecipeIngredientUnit
}

export class UpdateIngredientUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
    @Inject('IngredientRepository')
    private readonly ingredientsRepository: IngredientRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateIngredientInput,
    userId: string,
  ) {
    const recipeIngredient =
      await this.recipeRepository.findRecipeIngredientById(
        id,
        userId,
      )

    if (!recipeIngredient) {
      throw new NotFoundException(
        'Recipe ingredients not found',
      )
    }

    let ingredient: Ingredient | null =
      null

    if (input.ingredientId) {
      const ingredientExisting =
        await this.ingredientsRepository.findById(
          input.ingredientId,
          userId,
        )
      if (!ingredientExisting) {
        throw new NotFoundException(
          `Ingredient with id ${input.ingredientId} not found`,
        )
      }
      ingredient = ingredientExisting
    }

    if (
      ingredient &&
      ingredient.getId() !==
        recipeIngredient
          .getIngredient()
          .getId()
    ) {
      recipeIngredient.setIngredient(
        ingredient,
      )
    }

    if (input.quantity !== undefined) {
      recipeIngredient.setQuantity(
        input.quantity,
      )
    }

    if (input.unit) {
      recipeIngredient.setUnit(
        input.unit,
      )
    }

    await this.recipeRepository.saveRecipeIngredient(
      recipeIngredient,
    )

    return recipeIngredient
  }
}
