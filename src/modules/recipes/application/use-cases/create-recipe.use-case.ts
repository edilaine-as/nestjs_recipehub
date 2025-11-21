import { Inject } from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { Recipe } from '../../domain/entities/recipe.entity'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'

interface CreateRecipeInput {
  title: string
  category: RecipeCategory
  userId: string
}

export class CreateRecipeUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    input: CreateRecipeInput,
  ): Promise<Recipe> {
    const recipe = Recipe.create({
      title: input.title,
      category: input.category,
      userId: input.userId,
    })

    await this.recipeRepository.save(
      recipe,
    )

    return recipe
  }
}
