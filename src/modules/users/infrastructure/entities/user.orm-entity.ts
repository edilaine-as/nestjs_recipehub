import { IngredientOrmEntity } from 'src/modules/ingredients/infrastructure/entities/ingredient.orm-entity'
import { RecipeOrmEntity } from 'src/modules/recipes/infrastructure/entities/recipe.orm-entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => RecipeOrmEntity,
    (recipe) => recipe.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  recipes: RecipeOrmEntity[]

  @OneToMany(
    () => IngredientOrmEntity,
    (ingredient) => ingredient.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  ingredients: IngredientOrmEntity[]
}
