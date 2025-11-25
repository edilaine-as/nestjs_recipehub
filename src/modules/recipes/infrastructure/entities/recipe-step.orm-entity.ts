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

@Entity('recipe-steps')
export class RecipeStepOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  stepNumber: number

  @Column('text')
  description: string

  @ManyToOne(
    () => RecipeOrmEntity,
    (recipe) => recipe.recipeSteps,
  )
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeOrmEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
