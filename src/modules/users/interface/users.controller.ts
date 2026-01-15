import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case'
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case'
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guards'
import { JwtPayloadDto } from 'src/modules/auth/shared/dto/jwt-payload.dto'

class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  async createUser(
    @Body()
    body: CreateUserDto,
  ) {
    const user =
      await this.createUserUseCase.execute(
        body,
      )
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Request()
    req: Request & {
      user: JwtPayloadDto
    },
  ) {
    const userId = req.user.userId

    const updateUser =
      await this.updateUserUseCase.execute(
        userId,
        body,
      )

    return {
      id: updateUser.getId(),
      name: updateUser.getName(),
      email: updateUser.getEmail(),
    }
  }
}
