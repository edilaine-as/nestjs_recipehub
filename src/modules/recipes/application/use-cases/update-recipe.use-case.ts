import { Inject } from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { Recipe } from '../../domain/entities/recipe.entity'

interface UpdateRecipeInput {
  title?: string
  category?: RecipeCategory
}

export class UpdateRecipeUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateRecipeInput,
    userId: string,
  ): Promise<Recipe> {
    const recipe =
      await this.recipeRepository.findById(
        id,
      )
    if (!recipe) {
      throw new Error(
        'Recipe not found',
      )
    }

    if (recipe.getUserId() !== userId) {
      throw new Error(
        'You are not the owner of this recipe',
      )
    }

    if (input.title) {
      recipe.setTitle(input.title)
    }
    if (input.category) {
      recipe.setCategory(input.category)
    }

    return recipe
  }
}
