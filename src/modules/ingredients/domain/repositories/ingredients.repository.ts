import { Ingredient } from '../entities/ingredient.entity'

export interface IngredientRepository {
  save(
    ingredient: Ingredient,
  ): Promise<void>
  delete(id: string): Promise<void>
  findById(
    id: string,
    userId: string,
  ): Promise<Ingredient | null>
  findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Ingredient | null>
  findAll(
    userId: string,
  ): Promise<Ingredient[]>
}
