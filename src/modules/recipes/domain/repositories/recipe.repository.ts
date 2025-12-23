import { RecipeIngredient } from '../entities/recipe-ingredient.entity'
import { RecipeStep } from '../entities/recipe-step.entity'
import { Recipe } from '../entities/recipe.entity'

export interface RecipeRepository {
  save(recipe: Recipe): Promise<void>
  saveRecipeIngredient(
    ingredient: RecipeIngredient,
  ): Promise<void>
  saveRecipeStep(
    step: RecipeStep,
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
    userId: string,
  ): Promise<RecipeIngredient | null>
  findRecipeStepById(
    id: string,
    userId: string,
  ): Promise<RecipeStep | null>
  hasRecipeIngredientById(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ): Promise<boolean>
  hasRecipeIngredientByName(
    recipeId: string,
    name: string,
    userId: string,
  ): Promise<boolean>
  hasRecipeStepByNumber(
    recipeId: string,
    step: number,
    userId: string,
  ): Promise<boolean>
}
