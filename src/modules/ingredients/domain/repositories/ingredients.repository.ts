import { Ingredient } from '../entities/ingredient.entity'

export interface IngredientRepository {
  save(
    ingredient: Ingredient,
  ): Promise<void>
  delete(id: string): Promise<void>
  findById(
    id: string,
  ): Promise<Ingredient | null>
  findAllByUserId(
    id: string,
  ): Promise<Ingredient[]>
}
