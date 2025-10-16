import { Inject } from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { Recipe } from '../../domain/entities/recipe.entity'

export class DeleteRecipeUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    id: string,
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

    await this.recipeRepository.delete(
      id,
    )

    return recipe
  }
}
