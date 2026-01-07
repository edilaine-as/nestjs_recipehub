/* eslint-disable @typescript-eslint/require-await */

import { RecipeRepository } from '../../domain/repositories/recipe.repository'
import { RecipeIngredient } from '../../domain/entities/recipe-ingredient.entity'
import { RecipeStep } from '../../domain/entities/recipe-step.entity'
import { Recipe } from '../../domain/entities/recipe.entity'

export class RecipeRepositoryInMemory
  implements RecipeRepository
{
  private recipes: Recipe[] = []

  async save(
    recipe: Recipe,
  ): Promise<void> {
    const index =
      this.recipes.findIndex(
        (u) =>
          u.getId() === recipe.getId(),
      )

    if (index >= 0) {
      this.recipes[index] = recipe
      return
    }

    this.recipes.push(recipe)
  }

  async saveRecipeIngredient(
    ingredient: RecipeIngredient,
  ): Promise<void> {
    const recipe = this.recipes.find(
      (r) =>
        r.getId() ===
        ingredient.getRecipe().getId(),
    )

    if (!recipe) {
      throw new Error(
        'Recipe not found',
      )
    }

    recipe.addIngredient(
      ingredient.getIngredient(),
      ingredient.getQuantity(),
      ingredient.getUnit(),
    )
  }

  async saveRecipeStep(
    step: RecipeStep,
  ): Promise<void> {
    const recipe = this.recipes.find(
      (r) =>
        r.getId() ===
        step.getRecipe().getId(),
    )

    if (!recipe) {
      throw new Error(
        'Recipe not found',
      )
    }

    recipe.addStep(
      step.getStep(),
      step.getDescription(),
    )
  }

  async delete(
    id: string,
  ): Promise<void> {
    const index =
      this.recipes.findIndex(
        (u) => u.getId() === id,
      )

    if (index >= 0) {
      this.recipes.splice(index, 1)
    }

    return Promise.resolve()
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<Recipe | null> {
    return (
      this.recipes.find(
        (r) =>
          r.getId() === id &&
          r.getUserId() === userId,
      ) ?? null
    )
  }

  async findAll(
    userId: string,
  ): Promise<Recipe[]> {
    return this.recipes.filter(
      (r) => r.getUserId() === userId,
    )
  }

  async findRecipeIngredientById(
    id: string,
    userId: string,
  ): Promise<RecipeIngredient | null> {
    for (const recipe of this.recipes) {
      if (
        recipe.getUserId() !== userId
      ) {
        continue
      }

      const ingredient = recipe
        .getIngredients()
        .find((ri) => ri.getId() === id)

      if (ingredient) return ingredient
    }

    return null
  }

  async findRecipeStepById(
    id: string,
    userId: string,
  ): Promise<RecipeStep | null> {
    for (const recipe of this.recipes) {
      if (
        recipe.getUserId() !== userId
      ) {
        continue
      }

      const step = recipe
        .getSteps()
        .find((rs) => rs.getId() === id)

      if (step) return step
    }

    return null
  }

  async hasRecipeIngredientById(
    recipeId: string,
    ingredientId: string,
    userId: string,
  ): Promise<boolean> {
    const recipe = this.recipes.find(
      (r) =>
        r.getId() === recipeId &&
        r.getUserId() === userId,
    )

    if (!recipe) return false

    return recipe
      .getIngredients()
      .some(
        (ri) =>
          ri.getIngredient().getId() ===
          ingredientId,
      )
  }

  async hasRecipeIngredientByName(
    recipeId: string,
    name: string,
    userId: string,
  ): Promise<boolean> {
    const recipe = this.recipes.find(
      (r) =>
        r.getId() === recipeId &&
        r.getUserId() === userId,
    )

    if (!recipe) return false

    return recipe
      .getIngredients()
      .some(
        (ri) =>
          ri
            .getIngredient()
            .getName() === name,
      )
  }

  async hasRecipeStepByNumber(
    recipeId: string,
    step: number,
    userId: string,
  ): Promise<boolean> {
    const recipe = this.recipes.find(
      (r) =>
        r.getId() === recipeId &&
        r.getUserId() === userId,
    )

    if (!recipe) return false

    return recipe
      .getSteps()
      .some(
        (rs) => rs.getStep() === step,
      )
  }
}
