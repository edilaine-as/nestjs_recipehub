import {
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { Recipe } from '../../domain/entities/recipe.entity'

export class GetRecipeByIdUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<Recipe | null> {
    const recipe =
      await this.recipeRepository.findById(
        id,
        userId,
      )
    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      )
    }

    return recipe
  }
}
