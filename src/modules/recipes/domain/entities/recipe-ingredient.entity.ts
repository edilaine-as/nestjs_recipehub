import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'
import { v4 as uuidv4 } from 'uuid'
import { RecipeIngredientUnit } from '../../shared/enums/recipe-ingredient-unit.enum'
import { Recipe } from './recipe.entity'

export class RecipeIngredient {
  private readonly id: string
  private ingredient: Ingredient
  private recipe: Recipe
  private quantity: number
  private unit: RecipeIngredientUnit
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    ingredient: Ingredient,
    recipe: Recipe,
    quantity: number,
    unit: RecipeIngredientUnit,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.ingredient = ingredient
    this.recipe = recipe
    this.quantity = quantity
    this.unit = unit
    this.id = id ?? uuidv4()
    this.createdAt =
      createdAt ?? new Date()
    this.updatedAt =
      updatedAt ?? new Date()
  }

  static create(props: {
    ingredient: Ingredient
    recipe: Recipe
    quantity: number
    unit: RecipeIngredientUnit
  }) {
    return new RecipeIngredient(
      props.ingredient,
      props.recipe,
      props.quantity,
      props.unit,
    )
  }

  static restore(props: {
    id: string
    ingredient: Ingredient
    recipe: Recipe
    quantity: number
    unit: RecipeIngredientUnit
    createdAt: Date
    updatedAt: Date
  }): RecipeIngredient {
    return new RecipeIngredient(
      props.ingredient,
      props.recipe,
      props.quantity,
      props.unit,
      props.id,
      props.createdAt,
      props.updatedAt,
    )
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }

  getId() {
    return this.id
  }

  getIngredient(): Ingredient {
    return this.ingredient
  }

  getRecipe(): Recipe {
    return this.recipe
  }

  getQuantity() {
    return this.quantity
  }

  getUnit() {
    return this.unit
  }

  getCreatedAt() {
    return this.createdAt
  }

  getUpdatedAt() {
    return this.updatedAt
  }

  setQuantity(quantity: number) {
    this.quantity = quantity
    this.touchUpdatedAt()
  }

  setUnit(unit: RecipeIngredientUnit) {
    this.unit = unit
    this.touchUpdatedAt()
  }

  setIngredient(
    ingredient: Ingredient,
  ) {
    this.ingredient = ingredient
    this.touchUpdatedAt()
  }
}
