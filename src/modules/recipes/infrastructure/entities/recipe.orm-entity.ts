import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'
import { RecipeIngredientOrmEntity } from './recipe-ingredient.orm-entity'

@Entity('recipes')
export class RecipeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({
    type: 'enum',
    enum: RecipeCategory,
    default: RecipeCategory.MAIN_DISH,
  })
  category: RecipeCategory

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => UserOrmEntity,
    (user) => user.recipes,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user?: UserOrmEntity

  @OneToMany(
    () => RecipeIngredientOrmEntity,
    (recipeIngredient) =>
      recipeIngredient.recipe,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  recipeIngredients: RecipeIngredientOrmEntity[]

  // @OneToMany(
  //   () => RecipeStepOrmEntity,
  //   (recipeStep) => recipeStep.recipe,
  //   {
  //     cascade: true,
  //     onDelete: 'CASCADE',
  //   },
  // )
  // recipeStep: RecipeStepOrmEntity[]
}
