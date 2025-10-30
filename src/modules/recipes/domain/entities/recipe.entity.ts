import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { v4 as uuidv4 } from 'uuid'
import { RecipeIngredient } from './recipe-ingredient.entity'
import { Ingredient } from 'src/modules/ingredients/domain/entities/ingredient.entity'

export class Recipe {
  private readonly id: string
  private title: string
  private category: RecipeCategory
  private userId: string
  private ingredients: RecipeIngredient[]
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    title: string,
    category: RecipeCategory,
    userId: string,
    ingredients: RecipeIngredient[],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.title = title
    this.category = category
    this.userId = userId
    this.ingredients = ingredients
    this.id = id ?? uuidv4()
    this.createdAt =
      createdAt ?? new Date()
    this.updatedAt =
      updatedAt ?? new Date()
  }

  static create(props: {
    title: string
    category: RecipeCategory
    userId: string
    ingredients?: RecipeIngredient[]
  }) {
    return new Recipe(
      props.title,
      props.category,
      props.userId,
      props.ingredients || [],
    )
  }

  static restore(props: {
    id: string
    title: string
    category: RecipeCategory
    userId: string
    ingredients: RecipeIngredient[]
    createdAt: Date
    updatedAt: Date
  }): Recipe {
    return new Recipe(
      props.title,
      props.category,
      props.userId,
      props.ingredients,
      props.id,
      props.createdAt,
      props.updatedAt,
    )
  }

  addIngredient(
    ingredient: Ingredient,
    quantity: number,
  ) {
    const newRecipeIngredient =
      RecipeIngredient.create({
        ingredient,
        quantity,
      })

    this.ingredients.push(
      newRecipeIngredient,
    )

    this.touchUpdatedAt()
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }

  setTitle(title: string) {
    this.title = title
    this.touchUpdatedAt()
  }

  setCategory(
    category: RecipeCategory,
  ) {
    this.category = category
    this.touchUpdatedAt()
  }

  getIngredients(): RecipeIngredient[] {
    return this.ingredients
  }

  getId(): string {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getCategory(): RecipeCategory {
    return this.category
  }

  getUserId(): string {
    return this.userId
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }
}
