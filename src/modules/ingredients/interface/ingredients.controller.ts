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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

class CreateIngredientDto {
  @ApiProperty({
    description: 'Ingredient name',
    example: 'Sugar',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Ingredient type',
    enum: IngredientType,
    example:
      IngredientType.SUGAR_SWEETENER,
  })
  @IsEnum(IngredientType)
  type: IngredientType
}

class UpdateIngredientDto {
  @ApiPropertyOptional({
    description: 'Ingredient name',
    example: 'Brown sugar',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: 'Ingredient type',
    enum: IngredientType,
    example:
      IngredientType.SUGAR_SWEETENER,
  })
  @IsOptional()
  @IsEnum(IngredientType)
  type?: IngredientType
}

@ApiTags('Ingredients')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
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
  @ApiOperation({
    summary: 'Get ingredient by ID',
    description:
      'Retrieves an ingredient by its ID for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description:
      'Ingredient ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Ingredient retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
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
  @ApiOperation({
    summary: 'List ingredients',
    description:
      'Retrieves all ingredients for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description:
      'Ingredients retrieved successfully',
  })
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
  @ApiOperation({
    summary: 'Create ingredient',
    description:
      'Creates a new ingredient for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description:
      'Ingredient created successfully',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ingredient already exists',
  })
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Update ingredient',
    description:
      'Updates an ingredient for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description:
      'Ingredient ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Ingredient updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
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
  @ApiOperation({
    summary: 'Delete ingredient',
    description:
      'Deletes an ingredient by its ID for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description:
      'Ingredient ID (UUID v4)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Ingredient deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
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
