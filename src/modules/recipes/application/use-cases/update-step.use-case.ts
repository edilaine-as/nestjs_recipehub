import {
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'

interface UpdateStepInput {
  description: string
}

export class UpdateStepUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateStepInput,
    userId: string,
  ) {
    const recipeStep =
      await this.recipeRepository.findRecipeStepById(
        id,
        userId,
      )

    if (!recipeStep) {
      throw new NotFoundException(
        'Recipe step not found',
      )
    }

    if (input.description) {
      recipeStep.setDescription(
        input.description,
      )
    }

    await this.recipeRepository.saveRecipeStep(
      recipeStep,
    )

    return recipeStep
  }
}
