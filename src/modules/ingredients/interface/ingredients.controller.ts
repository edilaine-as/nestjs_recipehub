import {
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guards'
import { DeleteIngredientUseCase } from '../application/use-cases/delete-ingredient.use-case'
import { JwtPayloadDto } from 'src/modules/auth/shared/dto/jwt-payload.dto'

@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly deleteIngredientUseCase: DeleteIngredientUseCase,
  ) {}

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
