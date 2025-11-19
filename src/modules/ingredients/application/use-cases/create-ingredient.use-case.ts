import { Inject } from '@nestjs/common'
import type { IngredientRepository } from '../../domain/repositories/ingredients.repository'
import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'

interface CreateIngredientInput {
  name: string
  type: IngredientType
  userId: string
}

export class CreateIngredientUseCase {
  constructor(
    @Inject('IngredientRepository')
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async execute(
    input: CreateIngredientInput,
  ): Promise<Ingredient> {
    const ingredientByNameExisting =
      await this.ingredientRepository.findByNameAndUserId(
        input.name,
        input.userId,
      )

    if (ingredientByNameExisting) {
      throw new Error(
        `Ingredient already exists`,
      )
    }

    const ingredient =
      Ingredient.create(input)

    await this.ingredientRepository.save(
      ingredient,
    )

    return ingredient
  }
}
