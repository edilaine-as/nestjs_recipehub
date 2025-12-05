import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CreateRecipeUseCase } from '../application/use-cases/create-recipe.use-case'
import { RecipeCategory } from '../shared/enums/recipe-category.enum'
import { DeleteRecipeUseCase } from '../application/use-cases/delete-recipe.use-case'
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guards'
import { JwtPayloadDto } from 'src/modules/auth/shared/dto/jwt-payload.dto'
import { ListRecipesUseCase } from '../application/use-cases/list-recipes.use-case'
import { GetRecipeByIdUseCase } from '../application/use-cases/get-recipe-by-id.use-case'
import { IngredientType } from 'src/modules/ingredients/shared/enums/ingredient-type.enum'
import { AddIngredientUseCase } from '../application/use-cases/add-ingredient.use-case'
import { AddStepUseCase } from '../application/use-cases/add-step.use-case'
import { RecipeIngredientUnit } from '../shared/enums/recipe-ingredient-unit.enum'
import { UpdateRecipeUseCase } from '../application/use-cases/update-recipe.use-case'
import { UpdateIngredientUseCase } from '../application/use-cases/update-ingredient.use-case'
import { UpdateStepUseCase } from '../application/use-cases/update-step.use-case'

class CreateRecipeDto {
  title: string
  category: RecipeCategory
  userId: string
}

class AddIngredientDto {
  id?: string
  name: string
  type: IngredientType
  quantity: number
  unit: RecipeIngredientUnit
}

class AddStepDto {
  step: number
  description: string
}

class UpdateRecipeDto {
  title?: string
  category?: RecipeCategory
}

class UpdateRecipeIngredientDto {
  id?: string // ingredient
  quantity?: number
  unit?: RecipeIngredientUnit
}

class UpdateStepDto {
  description: string
}

@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly addIngredientUseCase: AddIngredientUseCase,
    private readonly addStepUseCase: AddStepUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
    private readonly updateIngredientUseCase: UpdateIngredientUseCase,
    private readonly updateStepUseCase: UpdateStepUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
    private readonly getRecipeUseCase: GetRecipeByIdUseCase,
    private readonly listRecipesUseCase: ListRecipesUseCase,
  ) {}

  @Get(':id')
  async getRecipeById(
    @Param('id') id: string,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipe =
      await this.getRecipeUseCase.execute(
        id,
        userId,
      )

    if (!recipe) {
      return null
    }

    return {
      id: recipe.getId(),
      title: recipe.getTitle(),
      category: recipe.getCategory(),
      ingredients: recipe
        .getIngredients()
        .map((ri) => ({
          id: ri.getId(),
          idIngredient: ri
            .getIngredient()
            .getId(),
          name: ri
            .getIngredient()
            .getName(),
          type: ri
            .getIngredient()
            .getType(),
          quantity: ri.getQuantity(),
          unit: ri.getUnit(),
        })),
      steps: recipe
        .getSteps()
        .map((step) => ({
          id: step.getId(),
          step: step.getStep(),
          description:
            step.getDescription(),
        })),
      userId: recipe.getUserId(),
    }
  }

  @Get()
  async listRecipes(
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipes =
      await this.listRecipesUseCase.execute(
        userId,
      )
    return (recipes ?? []).map(
      (recipe) => ({
        id: recipe.getId(),
        title: recipe.getTitle(),
        category: recipe.getCategory(),
        ingredients: recipe
          .getIngredients()
          .map((ri) => ({
            id: ri.getId(),
            idIngredient: ri
              .getIngredient()
              .getId(),
            name: ri
              .getIngredient()
              .getName(),
            type: ri
              .getIngredient()
              .getType(),
            quantity: ri.getQuantity(),
            unit: ri.getUnit(),
          })),
        steps: recipe
          .getSteps()
          .map((step) => ({
            id: step.getId(),
            step: step.getStep(),
            description:
              step.getDescription(),
          })),
        userId: recipe.getUserId(),
      }),
    )
  }

  @Post()
  async createRecipe(
    @Body() body: CreateRecipeDto,
  ) {
    const recipe =
      await this.createRecipeUseCase.execute(
        body,
      )
    return {
      id: recipe.getId(),
      title: recipe.getTitle(),
      category: recipe.getCategory(),
      userId: recipe.getUserId(),
    }
  }

  @Post(':id/ingredients')
  async addIngredient(
    @Param('id') id: string,
    @Body() body: AddIngredientDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const ingredient =
      await this.addIngredientUseCase.execute(
        id,
        body,
        userId,
      )

    return {
      message:
        'Ingredient added successfully',
      ingredient,
    }
  }

  @Post(':id/steps')
  async addStep(
    @Param('id') id: string,
    @Body() body: AddStepDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const step =
      await this.addStepUseCase.execute(
        id,
        body,
        userId,
      )

    return {
      message:
        'Step added successfully',
      step,
    }
  }

  @Put(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() body: UpdateRecipeDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipe =
      await this.updateRecipeUseCase.execute(
        id,
        body,
        userId,
      )
    return recipe
  }

  @Put(':id/ingredients')
  async updateIngredient(
    @Param('id') id: string,
    @Body()
    body: UpdateRecipeIngredientDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipeIngredient =
      await this.updateIngredientUseCase.execute(
        id,
        body,
        userId,
      )
    return recipeIngredient
  }

  @Put(':id/steps')
  async updateStep(
    @Param('id') id: string,
    @Body() body: UpdateStepDto,
    // @Request()
    // req: Request & {
    //   user: JwtPayloadDto
    // },
  ) {
    const recipeStep =
      await this.updateStepUseCase.execute(
        id,
        body,
      )

    return recipeStep
  }

  @Delete(':id')
  async deleteRecipe(
    @Param('id') id: string,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    await this.deleteRecipeUseCase.execute(
      id,
      userId,
    )
    return {
      message:
        'Recipe deleted successfully',
    }
  }
}
