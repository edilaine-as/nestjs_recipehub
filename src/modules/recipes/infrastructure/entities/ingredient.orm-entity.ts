import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
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
}
