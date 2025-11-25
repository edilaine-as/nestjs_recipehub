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
import { IngredientOrmEntity } from 'src/modules/ingredients/infrastructure/entities/ingredient.orm-entity'

@Entity('recipe-ingredients')
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
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeOrmEntity

  @ManyToOne(
    () => IngredientOrmEntity,
    (ingredient) =>
      ingredient.recipeIngredients,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'ingredientId' })
  ingredient: IngredientOrmEntity
}
