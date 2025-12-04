import { RecipeIngredient } from '../entities/recipe-ingredient.entity'
import { Recipe } from '../entities/recipe.entity'

export interface RecipeRepository {
  save(recipe: Recipe): Promise<void>
  saveRecipeIngredient(
    ingredient: RecipeIngredient,
  ): Promise<void>
  delete(id: string): Promise<void>
  findById(
    id: string,
    userId: string,
  ): Promise<Recipe | null>
  findAll(
    userId: string,
  ): Promise<Recipe[]>
  findRecipeIngredientById(
    id: string,
  ): Promise<RecipeIngredient | null>
}
