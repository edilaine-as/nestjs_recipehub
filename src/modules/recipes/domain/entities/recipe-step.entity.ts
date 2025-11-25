import { v4 as uuidv4 } from 'uuid'
import { Recipe } from './recipe.entity'

export class RecipeStep {
  private readonly id: string
  private step: number
  private description: string
  private readonly recipe: Recipe
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(
    step: number,
    description: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.step = step
    this.description = description
    this.id = id ?? uuidv4()
    this.createdAt =
      createdAt ?? new Date()
    this.updatedAt =
      updatedAt ?? new Date()
  }

  static create(props: {
    step: number
    description: string
  }) {
    return new RecipeStep(
      props.step,
      props.description,
    )
  }

  static restore(props: {
    id: string
    step: number
    description: string
    createdAt: Date
    updatedAt: Date
  }): RecipeStep {
    return new RecipeStep(
      props.step,
      props.description,
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

  getStep() {
    return this.step
  }

  getDescription() {
    return this.description
  }

  getCreatedAt() {
    return this.createdAt
  }

  getUpdatedAt() {
    return this.updatedAt
  }

  setStep(step: number) {
    this.step = step
    this.touchUpdatedAt()
  }

  setDescription(description: string) {
    this.description = description
    this.touchUpdatedAt()
  }
}
