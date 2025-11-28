import { Inject } from '@nestjs/common'
import type { IngredientRepository } from '../../domain/repositories/ingredients.repository'
import { Ingredient } from '../../domain/entities/ingredient.entity'

export class ListIngredientsUseCase {
  constructor(
    @Inject('IngredientRepository')
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<Ingredient[] | null> {
    const ingredients =
      await this.ingredientRepository.findAll(
        userId,
      )
    if (!ingredients) {
      return []
    }

    return ingredients
  }
}
