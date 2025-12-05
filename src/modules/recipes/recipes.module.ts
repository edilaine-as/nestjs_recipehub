import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecipeOrmEntity } from './infrastructure/entities/recipe.orm-entity'
import { RecipesController } from './interface/recipes.controller'
import { RecipeRepositoryImpl } from './infrastructure/repositories/recipe.repository.impl'
import { CreateRecipeUseCase } from './application/use-cases/create-recipe.use-case'
import { UpdateRecipeUseCase } from './application/use-cases/update-recipe.use-case'
import { DeleteRecipeUseCase } from './application/use-cases/delete-recipe.use-case'
import { GetRecipeByIdUseCase } from './application/use-cases/get-recipe-by-id.use-case'
import { ListRecipesUseCase } from './application/use-cases/list-recipes.use-case'
import { RecipeIngredientOrmEntity } from './infrastructure/entities/recipe-ingredient.orm-entity'
import { IngredientsModule } from '../ingredients/ingredients.module'
import { AddIngredientUseCase } from './application/use-cases/add-ingredient.use-case'
import { AddStepUseCase } from './application/use-cases/add-step.use-case'
import { RecipeStepOrmEntity } from './infrastructure/entities/recipe-step.orm-entity'
import { UpdateIngredientUseCase } from './application/use-cases/update-ingredient.use-case'
import { UpdateStepUseCase } from './application/use-cases/update-step.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeOrmEntity,
      RecipeIngredientOrmEntity,
      RecipeStepOrmEntity,
    ]),
    IngredientsModule,
  ],
  controllers: [RecipesController],
  providers: [
    {
      provide: 'RecipeRepository',
      useClass: RecipeRepositoryImpl,
    },
    CreateRecipeUseCase,
    AddIngredientUseCase,
    AddStepUseCase,
    UpdateRecipeUseCase,
    UpdateIngredientUseCase,
    UpdateStepUseCase,
    DeleteRecipeUseCase,
    GetRecipeByIdUseCase,
    ListRecipesUseCase,
  ],
  exports: [],
})
export class RecipesModule {}
