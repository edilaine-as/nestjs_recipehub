import { Inject } from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { Recipe } from '../../domain/entities/recipe.entity'

export class ListRecipesUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<Recipe[] | null> {
    const recipes =
      await this.recipeRepository.findAllByUserId(
        userId,
      )
    if (!recipes) {
      return []
    }

    return recipes
  }
}
