import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CreateRecipeUseCase } from '../application/use-cases/create-recipe.use-case'
import { RecipeCategory } from '../shared/enums/recipe-category.enum'
import { UpdateRecipeUseCase } from '../application/use-cases/update-recipe.use-case'
import { DeleteRecipeUseCase } from '../application/use-cases/delete-recipe.use-case'
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guards'
import { JwtPayloadDto } from 'src/modules/auth/shared/dto/jwt-payload.dto'

class CreateRecipeDto {
  title: string
  category: RecipeCategory
  userId: string
}

class UpdateRecipeDto {
  title?: string
  category?: RecipeCategory
}

@UseGuards(JwtAuthGuard)
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

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
    return {
      id: recipe.getId(),
      title: recipe.getTitle(),
      category: recipe.getCategory(),
      userId: recipe.getUserId(),
    }
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
