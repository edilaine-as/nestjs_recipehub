import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RecipeOrmEntity } from './recipe.orm-entity'
import { IngredientOrmEntity } from './ingredient.orm-entity'

@Entity('repice-ingredients')
export class RecipeIngredientOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('decimal')
  quantity: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => RecipeOrmEntity,
    (recipe) =>
      recipe.recipeIngredients,
  )
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeOrmEntity

  @ManyToOne(
    () => IngredientOrmEntity,
    (ingredient) =>
      ingredient.recipeIngredients,
  )
  @JoinColumn({ name: 'ingredientId' })
  ingredient: IngredientOrmEntity
}
