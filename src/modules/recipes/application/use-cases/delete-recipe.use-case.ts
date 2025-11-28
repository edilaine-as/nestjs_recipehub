import {
  Inject,
  NotFoundException,
} from '@nestjs/common'
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
        userId,
      )
    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      )
    }

    await this.recipeRepository.delete(
      id,
    )

    return recipe
  }
}
