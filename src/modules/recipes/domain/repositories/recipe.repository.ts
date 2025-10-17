import { Recipe } from '../entities/recipe.entity'

export interface RecipeRepository {
  save(recipe: Recipe): Promise<void>
  delete(id: string): Promise<void>
  findById(
    id: string,
  ): Promise<Recipe | null>
  findAllByUserId(
    id: string,
  ): Promise<Recipe[]>
}
