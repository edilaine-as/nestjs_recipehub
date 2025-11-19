import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngredientOrmEntity } from './infrastructure/entities/ingredient.orm-entity'
import { DeleteIngredientUseCase } from './application/use-cases/delete-ingredient.use-case'
import { IngredientsController } from './interface/ingredients.controller'
import { IngredientRepositoryImpl } from './infrastructure/repositories/ingredients.repository.impl'
import { GetIngredientByIdUseCase } from './application/use-cases/get-ingredient-by-id.use-case'
import { ListIngredientsUseCase } from './application/use-cases/list-ingredients.use-case'
import { CreateIngredientUseCase } from './application/use-cases/create-ingredient.use-case'
import { UpdateIngredientUseCase } from './application/use-cases/update-ingredient.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IngredientOrmEntity,
    ]),
  ],
  controllers: [IngredientsController],
  providers: [
    {
      provide: 'IngredientRepository',
      useClass:
        IngredientRepositoryImpl,
    },
    CreateIngredientUseCase,
    UpdateIngredientUseCase,
    DeleteIngredientUseCase,
    GetIngredientByIdUseCase,
    ListIngredientsUseCase,
  ],
  exports: [
    'IngredientRepository',
    TypeOrmModule,
  ],
})
export class IngredientsModule {}
