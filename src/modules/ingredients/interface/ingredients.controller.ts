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
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guards'
import { DeleteIngredientUseCase } from '../application/use-cases/delete-ingredient.use-case'
import { JwtPayloadDto } from 'src/modules/auth/shared/dto/jwt-payload.dto'
import { GetIngredientByIdUseCase } from '../application/use-cases/get-ingredient-by-id.use-case'
import { ListIngredientsUseCase } from '../application/use-cases/list-ingredients.use-case'
import { CreateIngredientUseCase } from '../application/use-cases/create-ingredient.use-case'
import { IngredientType } from '../shared/enums/ingredient-type.enum'
import { UpdateIngredientUseCase } from '../application/use-cases/update-ingredient.use-case'
import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

class CreateIngredientDto {
  @IsString()
  name: string

  @IsEnum(IngredientType)
  type: IngredientType
}

class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(IngredientType)
  type?: IngredientType
}

@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
    private readonly updateIngredientUseCase: UpdateIngredientUseCase,
    private readonly deleteIngredientUseCase: DeleteIngredientUseCase,
    private readonly getIngredientByIdUseCase: GetIngredientByIdUseCase,
    private readonly listIngredientsByIdUseCase: ListIngredientsUseCase,
  ) {}

  @Get(':id')
  async getIngredientById(
    @Param('id') id: string,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const ingredient =
      await this.getIngredientByIdUseCase.execute(
        id,
        userId,
      )

    if (!ingredient) {
      return null
    }

    return ingredient
  }

  @Get()
  async listIngredients(
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const ingredients =
      await this.listIngredientsByIdUseCase.execute(
        userId,
      )

    if (!ingredients) {
      return null
    }

    return ingredients
  }

  @Post()
  async createIngredient(
    @Body() body: CreateIngredientDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const ingredient =
      await this.createIngredientUseCase.execute(
        {
          ...body,
          userId,
        },
      )

    return {
      id: ingredient.getId(),
      name: ingredient.getName(),
      type: ingredient.getType(),
    }
  }

  @Put(':id')
  async updateIngredient(
    @Param('id') id: string,
    @Body() body: UpdateIngredientDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const ingredient =
      await this.updateIngredientUseCase.execute(
        id,
        body,
        userId,
      )

    return {
      id: ingredient.getId(),
      name: ingredient.getName(),
      type: ingredient.getType(),
      userId: ingredient.getUserId(),
    }
  }

  @Delete(':id')
  async deleteIngredient(
    @Param('id') id: string,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    await this.deleteIngredientUseCase.execute(
      id,
      userId,
    )
    return {
      message:
        'Ingredient deleted successfully',
    }
  }
}
