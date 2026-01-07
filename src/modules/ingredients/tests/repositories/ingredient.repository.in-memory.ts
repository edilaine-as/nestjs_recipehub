/* eslint-disable @typescript-eslint/require-await */

import { Ingredient } from '../../domain/entities/ingredient.entity'
import { IngredientRepository } from '../../domain/repositories/ingredients.repository'

export class IngredientRepositoryInMemory
  implements IngredientRepository
{
  private ingredients: Ingredient[] = []

  async save(
    ingredient: Ingredient,
  ): Promise<void> {
    const index =
      this.ingredients.findIndex(
        (i) =>
          i.getId() ===
          ingredient.getId(),
      )

    if (index >= 0) {
      this.ingredients[index] =
        ingredient
    }

    this.ingredients.push(ingredient)
  }

  async delete(
    id: string,
  ): Promise<void> {
    const index =
      this.ingredients.findIndex(
        (i) => i.getId() === id,
      )

    if (index >= 0) {
      this.ingredients.splice(index, 1)
    }

    return Promise.resolve()
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<Ingredient | null> {
    return (
      this.ingredients.find(
        (i) =>
          i.getId() === id &&
          i.getUserId() === userId,
      ) ?? null
    )
  }

  async findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Ingredient | null> {
    return (
      this.ingredients.find(
        (i) =>
          i.getName() === name &&
          i.getUserId() === userId,
      ) ?? null
    )
  }

  async findAll(
    userId: string,
  ): Promise<Ingredient[]> {
    return this.ingredients.filter(
      (i) => i.getUserId() === userId,
    )
  }
}
