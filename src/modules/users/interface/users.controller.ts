import {
  Body,
  Controller,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case'
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case'

class CreateUserDto {
  name: string
  email: string
  password: string
}

class UpdateUserDto {
  name: string
  email: string
  password: string
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

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    const updateUser =
      await this.updateUserUseCase.execute(
        id,
        body,
      )

    return updateUser
  }
}
