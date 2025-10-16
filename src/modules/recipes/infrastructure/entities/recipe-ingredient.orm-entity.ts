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

  @Column()
  recipeId: string

  @ManyToOne(() => RecipeOrmEntity)
  @JoinColumn({ name: 'recipeId' })
  recipe?: RecipeOrmEntity

  @Column()
  ingredientId: string

  @ManyToOne(() => IngredientOrmEntity)
  @JoinColumn({ name: 'ingredientId' })
  ingredient?: IngredientOrmEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
