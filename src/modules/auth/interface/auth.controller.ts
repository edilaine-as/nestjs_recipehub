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

class loginUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  async login(
    @Body()
    body: loginUserDto,
  ) {
    return this.loginUseCase.execute(
      body.email,
      body.password,
    )
  }
}
