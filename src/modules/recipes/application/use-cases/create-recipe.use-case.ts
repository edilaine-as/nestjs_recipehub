import { Inject } from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import type { IngredientRepository } from 'src/modules/ingredients/domain/repositories/ingredients.repository'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'

interface CreateRecipeInput {
  title: string
  category: RecipeCategory
  userId: string
  ingredients?: {
    id?: string
    name: string
    type: IngredientType
    quantity: number
  }[]
}

export class CreateRecipeUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
    @Inject('IngredientRepository')
    private readonly ingredientsRepository: IngredientRepository,
  ) {}

  async execute(
    input: CreateRecipeInput,
  ): Promise<Recipe> {
    const recipe = Recipe.create({
      title: input.title,
      category: input.category,
      userId: input.userId,
    })

    if (input.ingredients) {
      for (const ing of input.ingredients) {
        let ingredient: Ingredient

        if (ing.id) {
          const ingredientExisting =
            await this.ingredientsRepository.findById(
              ing.id,
            )
          if (!ingredientExisting) {
            throw new Error(
              `Ingredient with id ${ing.id} not found`,
            )
          }
          ingredient =
            ingredientExisting
        } else if (ing.name) {
          const ingredientByNameExisting =
            await this.ingredientsRepository.findByNameAndUserId(
              ing.name,
              input.userId,
            )

          if (
            !ingredientByNameExisting
          ) {
            const typeValue: IngredientType =
              ing.type

            ingredient =
              Ingredient.create({
                name: ing.name,
                type: typeValue,
                userId: input.userId,
              })

            await this.ingredientsRepository.save(
              ingredient,
            )
          } else {
            ingredient =
              ingredientByNameExisting
          }
        } else {
          const typeValue: IngredientType =
            ing.type

          ingredient =
            Ingredient.create({
              name: ing.name,
              type: typeValue,
              userId: input.userId,
            })

          await this.ingredientsRepository.save(
            ingredient,
          )
        }

        recipe.addIngredient(
          ingredient,
          ing.quantity,
        )
      }
    }

    await this.recipeRepository.save(
      recipe,
    )

    return recipe
  }
}
