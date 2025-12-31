import {
  ConflictException,
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
        userId,
      )
    if (!recipe)
      throw new NotFoundException(
        'Recipe not found',
      )

    const recipeStepByNumberExisting =
      await this.recipeRepository.hasRecipeStepByNumber(
        id,
        input.step,
        userId,
      )

    if (recipeStepByNumberExisting) {
      throw new ConflictException(
        `Step already exists in this recipe.`,
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
