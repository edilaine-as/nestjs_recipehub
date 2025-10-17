import {
  ForbiddenException,
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
      )
    if (!recipe) {
      throw new NotFoundException(
        'Recipe not found',
      )
    }

    if (recipe.getUserId() !== userId) {
      throw new ForbiddenException(
        'You are not the owner of this recipe',
      )
    }

    return recipe
  }
}
