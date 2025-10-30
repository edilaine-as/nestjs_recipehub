import {
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { IngredientRepository } from '../../domain/repositories/ingredients.repository'
import { Ingredient } from '../../domain/entities/ingredient.entity'

export class DeleteIngredientUseCase {
  constructor(
    @Inject('IngredientRepository')
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<Ingredient> {
    const ingredient =
      await this.ingredientRepository.findById(
        id,
      )
    if (!ingredient) {
      throw new NotFoundException(
        'Ingredient not found',
      )
    }

    if (
      ingredient.getUserId() !== userId
    ) {
      throw new ForbiddenException(
        'You are not the owner of this ingredient',
      )
    }

    await this.ingredientRepository.delete(
      id,
    )

    return ingredient
  }
}
