import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { v4 as uuidv4 } from 'uuid'

export class Recipe {
  private readonly id: string
  private title: string
  private category: RecipeCategory
  private userId: string
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    title: string,
    category: RecipeCategory,
    userId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.title = title
    this.category = category
    this.userId = userId
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
  }) {
    return new Recipe(
      props.title,
      props.category,
      props.userId,
    )
  }

  static restore(props: {
    id: string
    title: string
    category: RecipeCategory
    userId: string
    createdAt: Date
    updatedAt: Date
  }): Recipe {
    return new Recipe(
      props.title,
      props.category,
      props.userId,
      props.id,
      props.createdAt,
      props.updatedAt,
    )
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
