import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { User } from '../../domain/entities/user.entity'
import type { UserRepository } from '../../domain/repositories/user.repository'

interface CreateUserInput {
  name: string
  email: string
  password: string
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: CreateUserInput,
  ): Promise<User> {
    const userAlreadyExists =
      await this.userRepository.findByEmail(
        input.email,
      )

    if (userAlreadyExists) {
      throw new ConflictException(
        'User with this email already exists',
      )
    }

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
    })

    await this.userRepository.save(user)

    return user
  }
}
