import {
  Body,
  Controller,
  Post,
} from '@nestjs/common'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator'
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger'

class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@email.com',
  })
  email: string

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: 'password123',
  })
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user and returns an access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body()
    body: LoginUserDto,
  ) {
    return this.loginUseCase.execute(
      body.email,
      body.password,
    )
  }
}
