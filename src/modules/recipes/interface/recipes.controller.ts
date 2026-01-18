import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
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
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

class CreateRecipeDto {
  @IsString()
  @ApiProperty({
    description: 'Recipe title',
    example: 'Apple pie',
  })
  title: string

  @IsEnum(RecipeCategory)
  @ApiProperty({
    description: 'Recipe category',
    enum: RecipeCategory,
    example: RecipeCategory.DESSERT,
  })
  category: RecipeCategory
}

class AddIngredientDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description:
      'Ingredient ID (UUID v4)',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  id?: string

  @IsString()
  @ApiProperty({
    description: 'Ingredient name',
    example: 'Milk',
  })
  name: string

  @IsEnum(IngredientType)
  @ApiProperty({
    description: 'Ingredient type',
    enum: IngredientType,
    example: IngredientType.DAIRY,
  })
  type: IngredientType

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description:
      'Quantity of the ingredient',
    example: 1,
  })
  quantity: number

  @IsEnum(RecipeIngredientUnit)
  @ApiProperty({
    description:
      'Recipe ingredient unit',
    enum: RecipeIngredientUnit,
    example: RecipeIngredientUnit.CUP,
  })
  unit: RecipeIngredientUnit
}

class AddStepDto {
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Step of the recipe',
    example: 1,
  })
  step: number

  @IsString()
  @ApiProperty({
    description:
      'Description of the step recipe',
    example: 'Step number 1',
  })
  description: string
}

class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'New title of the recipe',
    example: 'Pie',
  })
  title?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'New category of the recipe',
    enum: RecipeCategory,
    example: RecipeCategory.MAIN_DISH,
  })
  category?: RecipeCategory
}

class UpdateRecipeIngredientDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description:
      'New ingredient ID to recipe ingredient',
    example:
      '550e8400-e29b-41d4-a716-446655440000',
  })
  id?: string // ingredient

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional({
    description:
      'New quantity to recipe ingredient',
    example: 200,
  })
  quantity?: number

  @IsOptional()
  @IsEnum(RecipeIngredientUnit)
  @ApiPropertyOptional({
    description:
      'New unit to recipe ingredient',
    enum: RecipeIngredientUnit,
    example:
      RecipeIngredientUnit.MILLILITER,
  })
  unit?: RecipeIngredientUnit
}

class UpdateStepDto {
  @IsString()
  @ApiProperty({
    description:
      'New description to step recipe',
    example: 'New step',
  })
  description: string
}

@ApiTags('Recipes')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
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
  @ApiOperation({
    summary: 'Get recipe by ID',
    description:
      'Retrieves a recipe by its ID for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipe ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipe retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
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
  @ApiOperation({
    summary: 'List recipes',
    description:
      'Retrieves all recipes belonging to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipes retrieved successfully',
  })
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
  @ApiOperation({
    summary: 'Create a recipe',
    description:
      'Creates a new recipe for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description:
      'Recipe created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
  })
  async createRecipe(
    @Body() body: CreateRecipeDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipe =
      await this.createRecipeUseCase.execute(
        {
          ...body,
          userId,
        },
      )
    return {
      id: recipe.getId(),
      title: recipe.getTitle(),
      category: recipe.getCategory(),
      userId: recipe.getUserId(),
    }
  }

  @Post(':id/ingredients')
  @ApiOperation({
    summary: 'Add ingredient to recipe',
    description:
      'Adds an ingredient to a recipe. The ingredient can be an existing one (by ID) or a new one (by name).',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipe ID (UUID v4)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Ingredient added successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'Recipe or ingredient not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ingredient already exists in this recipe',
  })
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
      ingredient: {
        id: ingredient.getId(),
        quantity:
          ingredient.getQuantity(),
        unit: ingredient.getUnit(),
        ingredient: {
          id: ingredient
            .getIngredient()
            .getId(),
          name: ingredient
            .getIngredient()
            .getName(),
          type: ingredient
            .getIngredient()
            .getType(),
        },
      },
    }
  }

  @Post(':id/steps')
  @ApiOperation({
    summary: 'Add step to recipe',
    description:
      'Adds a new step to a recipe. The step number must be unique within the recipe.',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipe ID (UUID v4)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Step added successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Step already exists in this recipe',
  })
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
      step: {
        id: step.getId(),
        step: step.getStep(),
        description:
          step.getDescription(),
      },
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update recipe',
    description:
      'Partially updates a recipe. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipe ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipe updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
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

  @Patch(':id/ingredients')
  @ApiOperation({
    summary: 'Update recipe ingredient',
    description:
      'Partially updates a recipe ingredient. Allows changing the ingredient, quantity, or unit.',
  })
  @ApiParam({
    name: 'id',
    description:
      'Recipe ingredient ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipe ingredient updated successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'Recipe ingredient or ingredient not found',
  })
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

    return {
      id: recipeIngredient.getId(),
      quantity: Number(
        recipeIngredient.getQuantity(),
      ),
      unit: recipeIngredient.getUnit(),
      ingredient: {
        id: recipeIngredient
          .getIngredient()
          .getId(),
        name: recipeIngredient
          .getIngredient()
          .getName(),
        type: recipeIngredient
          .getIngredient()
          .getType(),
      },
      recipe: {
        id: recipeIngredient
          .getRecipe()
          .getId(),
        title: recipeIngredient
          .getRecipe()
          .getTitle(),
        category: recipeIngredient
          .getRecipe()
          .getCategory(),
        userId: recipeIngredient
          .getRecipe()
          .getUserId(),
      },
    }
  }

  @Patch(':id/steps')
  @ApiOperation({
    summary: 'Update recipe step',
    description:
      'Partially updates a recipe step. Only the description can be updated.',
  })
  @ApiParam({
    name: 'id',
    description:
      'Recipe step ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipe step updated successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'Recipe step not found',
  })
  async updateStep(
    @Param('id') id: string,
    @Body() body: UpdateStepDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const recipeStep =
      await this.updateStepUseCase.execute(
        id,
        body,
        userId,
      )

    return {
      id: recipeStep.getId(),
      step: recipeStep.getStep(),
      description:
        recipeStep.getDescription(),
      recipe: {
        id: recipeStep
          .getRecipe()
          .getId(),
        title: recipeStep
          .getRecipe()
          .getTitle(),
        category: recipeStep
          .getRecipe()
          .getCategory(),
        userId: recipeStep
          .getRecipe()
          .getUserId(),
      },
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete recipe',
    description:
      'Deletes a recipe by its ID for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipe ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Recipe deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipe not found',
  })
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
