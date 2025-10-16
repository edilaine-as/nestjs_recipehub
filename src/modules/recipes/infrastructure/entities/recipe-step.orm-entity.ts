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

@Entity('repice-steps')
export class RecipeStepOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  recipeId: string

  @Column('int')
  stepNumber: number

  @Column('text')
  description: string

  @ManyToOne(() => RecipeOrmEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: RecipeOrmEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
