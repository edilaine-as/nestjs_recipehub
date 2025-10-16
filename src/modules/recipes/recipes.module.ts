import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecipeOrmEntity } from './infrastructure/entities/recipe.orm-entity'
import { RecipesController } from './interface/recipes.controller'
import { RecipeRepositoryImpl } from './infrastructure/repositories/recipe.repository.impl'
import { CreateRecipeUseCase } from './application/use-cases/create-recipe.use-case'
import { UpdateRecipeUseCase } from './application/use-cases/update-recipe.use-case'
import { DeleteRecipeUseCase } from './application/use-cases/delete-recipe.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeOrmEntity,
    ]),
  ],
  controllers: [RecipesController],
  providers: [
    {
      provide: 'RecipeRepository',
      useClass: RecipeRepositoryImpl,
    },
    CreateRecipeUseCase,
    UpdateRecipeUseCase,
    DeleteRecipeUseCase,
  ],
  exports: [],
})
export class RecipesModule {}
