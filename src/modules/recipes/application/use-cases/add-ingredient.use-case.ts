import {
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import type { IngredientRepository } from 'src/modules/ingredients/domain/repositories/ingredients.repository'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'

interface AddIngredientInput {
  id?: string
  name: string
  type: IngredientType
  quantity: number
  unit: RecipeIngredientUnit
}

export class AddIngredientUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
    @Inject('IngredientRepository')
    private readonly ingredientsRepository: IngredientRepository,
  ) {}

  async execute(
    id: string,
    input: AddIngredientInput,
    userId: string,
  ) {
    const recipe =
      await this.recipeRepository.findById(
        id,
        userId,
      )
    if (!recipe)
      throw new NotFoundException(
        'Recipe not found',
      )

    let ingredient: Ingredient

    if (input.id) {
      const ingredientExisting =
        await this.ingredientsRepository.findById(
          input.id,
          userId,
        )
      if (!ingredientExisting) {
        throw new NotFoundException(
          `Ingredient with id ${input.id} not found`,
        )
      }

      const recipeIngredientByIdExisting =
        await this.recipeRepository.hasRecipeIngredientById(
          id,
          input.id,
          userId,
        )

      if (
        recipeIngredientByIdExisting
      ) {
        throw new ConflictException(
          `Ingredient already exists in this recipe.`,
        )
      }

      ingredient = ingredientExisting
    } else if (input.name) {
      const ingredientByNameExisting =
        await this.ingredientsRepository.findByNameAndUserId(
          input.name,
          userId,
        )

      if (!ingredientByNameExisting) {
        const typeValue: IngredientType =
          input.type

        ingredient = Ingredient.create({
          name: input.name,
          type: typeValue,
          userId: userId,
        })

        await this.ingredientsRepository.save(
          ingredient,
        )
      } else {
        const recipeIngredientByNameExisting =
          await this.recipeRepository.hasRecipeIngredientByName(
            id,
            input.name,
            userId,
          )

        if (
          recipeIngredientByNameExisting
        ) {
          throw new ConflictException(
            `Ingredient already exists in this recipe.`,
          )
        }

        ingredient =
          ingredientByNameExisting
      }
    } else {
      const typeValue: IngredientType =
        input.type

      ingredient = Ingredient.create({
        name: input.name,
        type: typeValue,
        userId: userId,
      })

      await this.ingredientsRepository.save(
        ingredient,
      )
    }

    const recipeIngredient =
      recipe.addIngredient(
        ingredient,
        input.quantity,
        input.unit,
      )

    await this.recipeRepository.save(
      recipe,
    )

    return recipeIngredient
  }
}
