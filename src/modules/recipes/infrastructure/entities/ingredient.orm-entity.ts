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
import { IngredientType } from '../../shared/enums/ingredient-type.enum'
import { RecipeOrmEntity } from './recipe.orm-entity'
import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import { RecipeIngredientOrmEntity } from './recipe-ingredient.orm-entity'

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
  )
  recipeIngredients: RecipeOrmEntity[]
}
