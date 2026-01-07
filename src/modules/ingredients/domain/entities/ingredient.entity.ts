import { v4 as uuidv4 } from 'uuid'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'

export class Ingredient {
  private readonly id: string
  private name: string
  private type: IngredientType
  private userId: string
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    name: string,
    type: IngredientType,
    userId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.name = name
    this.type = type
    this.userId = userId
    this.id = id ?? uuidv4()
    this.createdAt =
      createdAt ?? new Date()
    this.updatedAt =
      updatedAt ?? new Date()
  }

  static create(props: {
    name: string
    type: IngredientType
    userId: string
  }) {
    return new Ingredient(
      props.name,
      props.type,
      props.userId,
    )
  }

  static restore(props: {
    id: string
    name: string
    type: IngredientType
    userId: string
    createdAt: Date
    updatedAt: Date
  }): Ingredient {
    return new Ingredient(
      props.name,
      props.type,
      props.userId,
      props.id,
      props.createdAt,
      props.updatedAt,
    )
  }

  private touchUpdatedAt() {
    this.updatedAt = new Date()
  }

  setName(name: string) {
    this.name = name
    this.touchUpdatedAt()
  }

  setType(type: IngredientType) {
    this.type = type
    this.touchUpdatedAt()
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  getType() {
    return this.type
  }

  getUserId() {
    return this.userId
  }

  getCreatedAt() {
    return this.createdAt
  }

  getUpdatedAt() {
    return this.updatedAt
  }
}
