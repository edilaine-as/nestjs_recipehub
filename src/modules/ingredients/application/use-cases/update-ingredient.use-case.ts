import {
  Inject,
  NotFoundException,
} from '@nestjs/common'
import type { IngredientRepository } from '../../domain/repositories/ingredients.repository'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { Ingredient } from '../../domain/entities/ingredient.entity'

interface UpdateIngredientInput {
  name?: string
  type?: IngredientType
}

export class UpdateIngredientUseCase {
  constructor(
    @Inject('IngredientRepository')
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateIngredientInput,
    userId: string,
  ): Promise<Ingredient> {
    const ingredient =
      await this.ingredientRepository.findById(
        id,
        userId,
      )

    if (!ingredient) {
      throw new NotFoundException(
        'Ingredient not found',
      )
    }

    if (input.name !== undefined) {
      ingredient.setName(input.name)
    }

    if (input.type !== undefined) {
      ingredient.setType(input.type)
    }

    return ingredient
  }
}
