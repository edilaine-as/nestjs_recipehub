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
import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import { RecipeIngredientOrmEntity } from 'src/modules/recipes/infrastructure/entities/recipe-ingredient.orm-entity'
import { IngredientType } from '../../shared/enums/ingredient-type.enum'

@Entity('ingredients')
export class IngredientOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: IngredientType,
  })
  type: IngredientType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => UserOrmEntity,
    (user) => user.ingredients,
  )
  @JoinColumn({ name: 'userId' })
  user?: UserOrmEntity

  @OneToMany(
    () => RecipeIngredientOrmEntity,
    (recipeIngredient) =>
      recipeIngredient.ingredient,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  recipeIngredients: RecipeIngredientOrmEntity[]
}
