import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('repice-steps')
export class RecipeStepOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  stepNumber: number

  @Column('text')
  description: string

  // @ManyToOne(
  //   () => RecipeOrmEntity,
  //   (recipe) => recipe.recipeStep,
  // )
  // @JoinColumn({ name: 'recipeId' })
  // recipe: RecipeOrmEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
