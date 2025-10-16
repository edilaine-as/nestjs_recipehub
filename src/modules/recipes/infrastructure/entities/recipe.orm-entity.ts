import { UserOrmEntity } from 'src/modules/users/infrastructure/entities/user.orm-entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RecipeCategory } from '../../shared/enums/recipe-category.enum'

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

  @Column()
  userId: string

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserOrmEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
