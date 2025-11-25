import {
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { RecipeRepository } from '../../domain/repositories/recipe.repository'

interface AddStepInput {
  step: number
  description: string
}

export class AddStepUseCase {
  constructor(
    @Inject('RecipeRepository')
    private readonly recipeRepository: RecipeRepository,
  ) {}

  async execute(
    id: string,
    input: AddStepInput,
    userId: string,
  ) {
    const recipe =
      await this.recipeRepository.findById(
        id,
      )
    if (!recipe)
      throw new NotFoundException(
        'Recipe not found',
      )

    if (recipe.getUserId() !== userId) {
      throw new ForbiddenException(
        'You are not the owner of this recipe',
      )
    }

    recipe.addStep(
      input.step,
      input.description,
    )

    await this.recipeRepository.save(
      recipe,
    )
  }
}
