import {
  Body,
  Controller,
  Post,
  Patch,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string

  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@email.com',
  })
  email: string

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  password: string
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
  })
  name?: string

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@email.com',
  })
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({
    description: 'User password',
    example: 'password123',
  })
  password?: string
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Creates a new user in the system',
  })
  @ApiResponse({
    status: 409,
    description:
      'User with this email already exists',
  })
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
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({
    summary: 'Partially update a user',
    description:
      'Updates one or more fields of an existing user',
  })
  @ApiResponse({
    status: 200,
    description:
      'User updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Email is already in use',
  })
  async updateUser(
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
