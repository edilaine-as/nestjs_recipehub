import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngredientOrmEntity } from './infrastructure/entities/ingredient.orm-entity'
import { DeleteIngredientUseCase } from './application/use-cases/delete-ingredient.use-case'
import { IngredientsController } from './interface/ingredients.controller'
import { IngredientRepositoryImpl } from './infrastructure/repositories/ingredients.repository.impl'

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
    DeleteIngredientUseCase,
  ],
  exports: [
    'IngredientRepository',
    TypeOrmModule,
  ],
})
export class IngredientsModule {}
