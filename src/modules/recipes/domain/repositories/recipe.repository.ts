import { Recipe } from '../entities/recipe.entity'

export interface RecipeRepository {
  save(recipe: Recipe): Promise<void>
  delete(id: string): Promise<void>
  findById(
    id: string,
    userId: string,
  ): Promise<Recipe | null>
  findAll(
    userId: string,
  ): Promise<Recipe[]>
}
